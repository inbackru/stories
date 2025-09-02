import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Eye, Download, Trash2, Home, Clock } from "lucide-react";
import { Link } from "wouter";
import { StoryTemplate } from "@shared/schema";

export default function Templates() {
  const { toast } = useToast();

  const { data: templates, isLoading } = useQuery({
    queryKey: ["/api/templates"],
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Неизвестно";
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ru-RU").format(amount);
  };

  const bankLabels = {
    sovkombank: "Совкомбанк",
    sberbank: "Сбербанк",
    vtb: "ВТБ",
    alfabank: "Альфа-Банк",
    tinkoff: "Тинькофф",
  };

  const propertyTypeLabels = {
    "1k": "1К квартира",
    "2k": "2К квартира",
    "3k": "3К квартира",
    studio: "Студия",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Home className="text-primary-foreground text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Мои шаблоны</h1>
                <p className="text-sm text-muted-foreground">Сохраненные шаблоны недвижимости</p>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline" data-testid="button-back-to-generator">
                ← Назад к генератору
              </Button>
            </Link>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded mb-4"></div>
                  <div className="h-32 bg-muted rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Home className="text-primary-foreground text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Мои шаблоны</h1>
              <p className="text-sm text-muted-foreground">
                Всего шаблонов: {(templates as StoryTemplate[])?.length || 0}
              </p>
            </div>
          </div>
          <Link href="/">
            <Button variant="outline" data-testid="button-back-to-generator">
              ← Назад к генератору
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {!templates || (templates as StoryTemplate[]).length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Home className="text-muted-foreground text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Пока нет шаблонов</h2>
            <p className="text-muted-foreground mb-8">
              Создайте свой первый шаблон недвижимости для WhatsApp stories
            </p>
            <Link href="/">
              <Button data-testid="button-create-first-template">
                Создать первый шаблон
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(templates as StoryTemplate[]).map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground truncate" data-testid={`text-template-name-${template.id}`}>
                      {template.name}
                    </h3>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDate(template.createdAt)}
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div>
                      <p className="text-sm font-medium text-foreground" data-testid={`text-address-${template.id}`}>
                        {template.propertyAddress}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" data-testid={`badge-type-${template.id}`}>
                          {propertyTypeLabels[template.propertyType as keyof typeof propertyTypeLabels]}
                        </Badge>
                        <span className="text-sm text-muted-foreground" data-testid={`text-area-${template.id}`}>
                          {template.propertyArea} м²
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Стоимость</p>
                        <p className="font-medium text-foreground" data-testid={`text-cost-${template.id}`}>
                          {formatCurrency(template.totalCost)} ₽
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Платеж</p>
                        <p className="font-medium text-foreground" data-testid={`text-payment-${template.id}`}>
                          {formatCurrency(template.monthlyPayment)} ₽
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Ставка:</span>
                      <span className="font-medium text-foreground" data-testid={`text-rate-${template.id}`}>
                        {template.bankRate}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Банк:</span>
                      <span className="font-medium text-foreground" data-testid={`text-bank-${template.id}`}>
                        {bankLabels[template.selectedBank as keyof typeof bankLabels]}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link href={`/?template=${template.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        data-testid={`button-view-${template.id}`}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Редактировать
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid={`button-download-${template.id}`}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline" 
                      size="sm"
                      data-testid={`button-delete-${template.id}`}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}