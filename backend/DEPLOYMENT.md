# APPNIX SAAS — PRODUCTION INFRASTRUCTURE & DEPLOYMENT GUIDE

This guide provides step-by-step instructions for deploying the **Appnix SaaS** production backend to **AWS EC2 + AWS RDS PostgreSQL + Cloudflare R2 + Meta Embedded Signup**.

---

## 1. Architecture Overview

```
[ Internet / Clients ]
        │ (HTTPS :443)
        ▼
[ Cloudflare DNS / CDN / DDoS Shield ]
        │ (api.appnix.co.in)
        ▼
[ AWS EC2 Linux Instance (Public Subnet) ]
  ├── Nginx Reverse Proxy (Port 443 -> Port 4000)
  └── PM2 Process Manager (NestJS Cluster on 127.0.0.1:4000)
        │
        ├── (Private Subnet / Security Group 5432)
        ▼
[ AWS RDS PostgreSQL (appnix_production) ]
        │
        ├── (S3-Compatible Object Storage)
        ▼
[ Cloudflare R2 Bucket (appnix-media-prod) ]
```

---

## 2. Cloudflare R2 Object Storage Setup (Manual Steps)

1. Log into [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **R2**.
2. Click **Create bucket** and name it `appnix-media-prod` (Region: Automatic).
3. Under **Manage R2 API Tokens**, click **Create API Token**:
   - Permissions: **Object Read & Write**
   - Bucket: Apply to `appnix-media-prod` (or all buckets)
   - TTL: Permanent or as required by your security policy.
4. Note the generated:
   - **Access Key ID** -> `R2_ACCESS_KEY_ID`
   - **Secret Access Key** -> `R2_SECRET_ACCESS_KEY`
   - **Account ID** -> `R2_ACCOUNT_ID`
   - **S3 API URL** -> `R2_ENDPOINT` (`https://<ACCOUNT_ID>.r2.cloudflarestorage.com`)
5. (Optional) In the bucket settings, configure **Custom Domain** `media.appnix.co.in` if public media routing is desired.

---

## 3. AWS RDS PostgreSQL Setup (Manual Steps)

1. Log into AWS Console and navigate to **Amazon RDS**.
2. Create a PostgreSQL DB Instance:
   - Engine: **PostgreSQL 16+**
   - DB Instance class: `db.t4g.micro` or `db.t4g.small` (Cost-conscious, Graviton powered)
   - Storage: 20GB GP3 with autoscaling enabled up to 100GB.
   - Master username: `appnix_admin`
   - Initial database name: `appnix_production`
3. **VPC & Networking**:
   - Place RDS in the **Private DB Subnet** of your VPC.
   - **Publicly Accessible**: Select **NO** (Never expose database to `0.0.0.0/0`).
4. **Security Group Configuration**:
   - In RDS Security Group, allow Inbound **TCP Port 5432** ONLY from the **EC2 Backend Security Group ID** (`sg-xxxxxxxxx`).
5. **Connection String**:
   ```
   DATABASE_URL=postgresql://appnix_admin:YOUR_DB_PASSWORD@appnix-prod-rds.xxxxxx.us-east-1.rds.amazonaws.com:5432/appnix_production?schema=public&sslmode=require
   ```

---

## 4. AWS EC2 Instance Setup & Configuration

1. Launch an EC2 Instance:
   - OS: **Ubuntu Server 24.04 LTS (HVM)**
   - Instance Type: `t4g.small` or `t3.small` (2 vCPU, 2GB RAM)
   - Storage: 30GB GP3 EBS volume.
   - Security Group Inbound Rules:
     - Port 22 (SSH) -> Your Office/VPN IP only
     - Port 80 (HTTP) -> `0.0.0.0/0` (for ACME SSL challenges)
     - Port 443 (HTTPS) -> `0.0.0.0/0`
2. Connect to EC2 via SSH and run initial server preparation:
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install -y curl git build-essential nginx certbot python3-certbot-nginx

   # Install Node.js 20 LTS
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install PM2 globally
   sudo npm install -g pm2
   ```

3. Clone the Repository & Configure Environment:
   ```bash
   sudo mkdir -p /var/www/appnix-backend
   sudo chown -R ubuntu:ubuntu /var/www/appnix-backend
   cd /var/www/appnix-backend

   git clone <YOUR_GIT_REPO_URL> .
   cd backend

   # Copy and fill production .env
   cp .env.example .env
   nano .env
   ```

4. Install Dependencies & Build:
   ```bash
   npm ci
   npm run prisma:generate
   npx prisma migrate deploy
   npm run build
   ```

5. Start Application with PM2:
   ```bash
   sudo mkdir -p /var/log/appnix
   sudo chown -R ubuntu:ubuntu /var/log/appnix

   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

6. Configure Nginx & SSL Certificate:
   ```bash
   sudo cp nginx/api.appnix.co.in.conf /etc/nginx/sites-available/api.appnix.co.in.conf
   sudo ln -s /etc/nginx/sites-available/api.appnix.co.in.conf /etc/nginx/sites-enabled/

   # Obtain free TLS certificate from Let's Encrypt
   sudo certbot --nginx -d api.appnix.co.in

   # Test Nginx configuration and reload
   sudo nginx -t
   sudo systemctl reload nginx
   ```

---

## 5. Meta Developer Dashboard & Embedded Signup Setup

1. Go to [Meta for Developers](https://developers.facebook.com/) and open your Business App.
2. Under **Products**, add **WhatsApp**.
3. Under **WhatsApp > Quickstart / Embedded Signup**:
   - Create an Embedded Signup Configuration.
   - Note the **Configuration ID** -> `META_EMBEDDED_SIGNUP_CONFIG_ID`.
4. Under **App Settings > Basic**:
   - Note **App ID** -> `META_APP_ID`.
   - Note **App Secret** -> `META_APP_SECRET`.
5. Under **WhatsApp > Configuration / Webhooks**:
   - Callback URL: `https://api.appnix.co.in/api/v1/webhooks/whatsapp`
   - Verify Token: Same string as `META_WEBHOOK_VERIFY_TOKEN` in `.env`.
   - Webhook fields: Subscribe to `messages`, `message_template_status_update`, `phone_number_name_update`, `account_update`.

---

## 6. Production Health Check & Verification

Once deployed, verify the endpoint:
```bash
curl -I https://api.appnix.co.in/api/v1/health
```

Expected JSON response:
```json
{
  "status": "ok",
  "timestamp": "2026-09-02T10:00:00.000Z",
  "uptimeSeconds": 120,
  "environment": "production",
  "version": "1.0.0",
  "checks": {
    "database": { "status": "connected", "latencyMs": 14 },
    "storage": { "status": "configured", "provider": "Cloudflare R2", "bucket": "appnix-media-prod" },
    "memory": { "rssMb": 85, "heapUsedMb": 42, "heapTotalMb": 60 }
  }
}
```
