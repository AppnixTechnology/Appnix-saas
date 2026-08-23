"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Search, RefreshCw, FileText, CheckCircle2, Loader2, Sparkles, Save, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { MetaTemplate } from "@/hooks/useCampaignWizard";

interface CampaignStepTemplateProps {
  campaign: {
    metaTemplateId: string;
    metaTemplateName: string;
    metaTemplateLanguage: string;
    channel: string;
  };
  templates: MetaTemplate[];
  selectTemplate: (templateId: string) => void;
  canProceed: boolean;
  onNext: () => void;
  onPrev: () => void;
  isLoading?: boolean;
  isRefreshing?: boolean;
  loadTemplates: (channel?: string) => Promise<void>;
  onSaveDraft?: () => void;
  isSaving?: boolean;
}

export function CampaignStepTemplate({
  campaign,
  templates,
  selectTemplate,
  canProceed,
  onNext,
  onPrev,
  isLoading,
  isRefreshing,
  loadTemplates,
  onSaveDraft,
  isSaving,
}: CampaignStepTemplateProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");

  const categories = useMemo(() => {
    const cats = templates.map((t) => t.category).filter(Boolean);
    return [...new Set(cats)];
  }, [templates]);

  const languages = useMemo(() => {
    const langs = templates.map((t) => t.language).filter(Boolean);
    return [...new Set(langs)];
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const nameMatch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
      const previewMatch = template.preview?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
      const matchesSearch = nameMatch || previewMatch;
      const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
      const matchesLanguage = selectedLanguage === "all" || template.language === selectedLanguage;
      return matchesSearch && matchesCategory && matchesLanguage;
    });
  }, [templates, searchQuery, selectedCategory, selectedLanguage]);

  const handleRefresh = async () => {
    await loadTemplates(campaign.channel);
  };

  const selectedTemplate = templates.find((t) => t.id === campaign.metaTemplateId);

  return (
    <div className="space-y-6 max-w-4xl">
      <Card>
        <CardHeader className="border-b pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl font-bold">Select Message Template</CardTitle>
              </div>
              <CardDescription>
                Approved Meta templates for <strong>{campaign.channel}</strong>. Manual WhatsApp message typing is disabled to ensure policy compliance.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
              className="gap-2 shrink-0 self-start sm:self-auto"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", (isRefreshing || isLoading) && "animate-spin")} />
              <span>Refresh Meta Templates</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates by name or message text..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[140px] h-9 text-xs">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-[130px] h-9 text-xs">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Template Cards or Loading / Empty states */}
          {isLoading || isRefreshing ? (
            <div className="flex flex-col items-center justify-center py-16 border rounded-xl bg-muted/20">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
              <p className="text-sm font-medium text-foreground">Fetching approved templates from Meta...</p>
              <p className="text-xs text-muted-foreground mt-1">Syncing template components and variables</p>
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-16 border rounded-xl bg-muted/20 p-6">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-60" />
              <h3 className="text-base font-semibold text-foreground">
                No approved templates are available for this channel.
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5 max-w-md mx-auto">
                Ensure you have created and obtained Meta approval for your WhatsApp message templates inside Meta Business Manager.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="mt-4 gap-2 text-xs"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Retry Sync
              </Button>
            </div>
          ) : (
            <div className="grid gap-3.5 md:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template) => {
                const isSelected = campaign.metaTemplateId === template.id;
                const hasVariables = template.components.some(
                  (c) => c.text && /\{\{(\d+|[a-zA-Z_][a-zA-Z0-9_]*)\}\}/.test(c.text)
                );

                return (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => selectTemplate(template.id)}
                    className={cn(
                      "group relative flex flex-col justify-between p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer",
                      isSelected
                        ? "border-primary bg-primary/5 ring-2 ring-primary shadow-sm"
                        : "border-border hover:border-primary/40 hover:bg-muted/30"
                    )}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2 pr-6">
                        <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors font-mono line-clamp-1">
                          {template.name}
                        </h4>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {template.category}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {template.language}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] px-1.5 py-0 font-medium",
                            template.status === "APPROVED"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-amber-50 text-amber-700 border-amber-300"
                          )}
                        >
                          {template.status}
                        </Badge>
                      </div>

                      {template.preview && (
                        <p className="text-xs text-muted-foreground line-clamp-3 bg-muted/40 p-2 rounded-md border border-border/50 mb-3">
                          {template.preview}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        {hasVariables ? (
                          <span className="text-primary font-medium flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            Dynamic Template
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Static Template</span>
                        )}
                      </span>
                      {template.lastUpdated && (
                        <span>{new Date(template.lastUpdated).toLocaleDateString()}</span>
                      )}
                    </div>

                    {isSelected && (
                      <div className="absolute top-3.5 right-3.5 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {filteredTemplates.length === 0 && templates.length > 0 && (
            <div className="text-center py-10 border rounded-xl bg-muted/10 text-xs text-muted-foreground">
              No templates matching your filter criteria. Try searching for a different keyword or clearing filters.
            </div>
          )}

          {selectedTemplate && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Selected Template</p>
                  <p className="text-sm font-bold text-foreground font-mono">
                    {selectedTemplate.name}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs uppercase bg-background">
                {selectedTemplate.category}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between pt-2">
        <Button variant="outline" onClick={onPrev} className="gap-2">
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-3">
          {onSaveDraft && (
            <Button
              type="button"
              variant="outline"
              onClick={onSaveDraft}
              disabled={isSaving}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save as Draft"}
            </Button>
          )}
          <Button
            onClick={onNext}
            disabled={!canProceed}
            className="gap-2 px-6 shadow-sm"
          >
            Continue to Configure
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}