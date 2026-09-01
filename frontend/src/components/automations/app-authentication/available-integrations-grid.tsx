import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  CheckCircle2,
  ExternalLink,
  KeyRound,
  Sparkles,
  ChevronRight,
  Filter,
  X,
} from 'lucide-react';
import { CatalogApp, AppCategory, ConnectedApp } from './types';
import { AppBrandLogo } from './app-brand-logos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface AvailableIntegrationsGridProps {
  catalog: CatalogApp[];
  connectedApps: ConnectedApp[];
  onConnectApp: (app: CatalogApp) => void;
}

const CATEGORIES: AppCategory[] = [
  'All',
  'CRM',
  'Payment Gateways',
  'AI',
  'Database',
  'E-Commerce',
  'Communication',
];

export function AvailableIntegrationsGrid({
  catalog,
  connectedApps,
  onConnectApp,
}: AvailableIntegrationsGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<AppCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const connectedAppNames = useMemo(() => {
    return new Set(connectedApps.map((a) => a.appName));
  }, [connectedApps]);

  const filteredCatalog = useMemo(() => {
    return catalog.filter((app) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        app.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [catalog, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search integrations by name or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 text-sm bg-card"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-card text-muted-foreground border border-border hover:bg-muted hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCatalog.map((app) => {
          const isConnected = connectedAppNames.has(app.id);

          return (
            <div
              key={app.id}
              className="group relative flex flex-col justify-between rounded-xl border border-border/80 bg-card p-5 shadow-xs transition-all hover:border-primary/50 hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <AppBrandLogo appName={app.id} size="lg" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-foreground">{app.name}</h4>
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">
                        {app.category}
                      </span>
                    </div>
                  </div>

                  {isConnected ? (
                    <Badge
                      variant="outline"
                      className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px] font-semibold py-0.5 px-2 gap-1"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      Connected
                    </Badge>
                  ) : app.oauthSupported ? (
                    <Badge
                      variant="outline"
                      className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20 text-[10px] font-medium py-0.5 px-2"
                    >
                      OAuth 2.0
                    </Badge>
                  ) : null}
                </div>

                <p className="mt-3 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {app.description}
                </p>

                <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                  {app.authTypes.map((type) => (
                    <span
                      key={type}
                      className="inline-block rounded-md bg-muted/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground border border-border/40"
                    >
                      {type.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between pt-3 border-t border-border/60">
                {app.docsUrl ? (
                  <a
                    href={app.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                  >
                    API Docs <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-[11px] text-muted-foreground">Standard REST API</span>
                )}

                <Button
                  size="sm"
                  variant={isConnected ? 'outline' : 'default'}
                  onClick={() => onConnectApp(app)}
                  className={`text-xs h-8 gap-1.5 font-semibold cursor-pointer ${
                    isConnected
                      ? 'hover:bg-muted text-foreground'
                      : 'bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-xs'
                  }`}
                >
                  <Plus className="h-3.5 w-3.5" />
                  {isConnected ? 'Add Another Key' : 'Connect App'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCatalog.length === 0 && (
        <div className="py-16 text-center text-muted-foreground space-y-3 rounded-xl border border-dashed border-border bg-card/40">
          <KeyRound className="h-10 w-10 mx-auto text-muted-foreground/40" />
          <p className="font-semibold text-sm">No integrations match your search.</p>
          <p className="text-xs max-w-sm mx-auto">
            Can't find your tool? Use Custom Webhook / Bearer Token integration to connect any custom REST API.
          </p>
        </div>
      )}
    </div>
  );
}
