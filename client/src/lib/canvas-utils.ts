import { PropertyFormData } from "@shared/schema";

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1920;

const bankLogos = {
  sovkombank: "СОВКОМБАНК",
  sberbank: "СБЕРБАНК", 
  vtb: "ВТБ",
  alfabank: "АЛЬФА-БАНК",
  tinkoff: "ТИНЬКОФФ",
};

const propertyTypeLabels = {
  "1k": "1К КВАРТИРА",
  "2k": "2К КВАРТИРА",
  "3k": "3К КВАРТИРА",
  studio: "СТУДИЯ",
};

export interface FloorPlanPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BackgroundPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export async function drawStoryCanvas(
  canvas: HTMLCanvasElement,
  propertyData: PropertyFormData,
  backgroundImage: File | null,
  floorPlan: File | null,
  floorPlanPosition?: FloorPlanPosition,
  backgroundPosition?: BackgroundPosition
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Set canvas size
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  // Clear canvas with gradient background
  const gradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  gradient.addColorStop(0, "hsl(217, 91%, 60%)");
  gradient.addColorStop(1, "hsl(217, 91%, 45%)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Draw background image if available
  if (backgroundImage) {
    try {
      const img = await loadImage(backgroundImage);
      
      // Use custom background position if provided
      if (backgroundPosition) {
        ctx.drawImage(img, backgroundPosition.x, backgroundPosition.y, backgroundPosition.width, backgroundPosition.height);
      } else {
        const { x, y, width, height } = calculateImageFit(img, CANVAS_WIDTH, CANVAS_HEIGHT * 0.7);
        ctx.drawImage(img, x, y + 150, width, height);
      }
      
      // Add dark overlay for text readability
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    } catch (error) {
      console.error("Failed to load background image:", error);
    }
  }

  // Draw header text
  ctx.fillStyle = "white";
  ctx.font = "bold 64px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;
  ctx.fillText(
    propertyData.propertyAddress.toUpperCase() || "АДРЕС НЕ УКАЗАН",
    CANVAS_WIDTH / 2,
    150
  );
  ctx.shadowBlur = 0;

  // Draw financial info card
  const cardY = CANVAS_HEIGHT - 600;
  const cardHeight = 300;
  const cardPadding = 40;

  // Card background with blur effect
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(cardPadding, cardY, CANVAS_WIDTH - cardPadding * 2, cardHeight);

  // Card content
  ctx.fillStyle = "white";
  ctx.textAlign = "left";

  // Left side - Property info
  ctx.font = "32px Inter, sans-serif";
  ctx.fillStyle = "#9CA3AF";
  ctx.fillText("БАЗОВАЯ ИПОТЕКА", cardPadding + 30, cardY + 60);

  ctx.font = "bold 40px Inter, sans-serif";
  ctx.fillStyle = "white";
  ctx.fillText(
    propertyTypeLabels[propertyData.propertyType] || "ТИП НЕ УКАЗАН",
    cardPadding + 30,
    cardY + 110
  );

  ctx.font = "32px Inter, sans-serif";
  ctx.fillText(
    `${propertyData.propertyArea || 0} м²`,
    cardPadding + 30,
    cardY + 150
  );

  // Right side - Monthly payment
  ctx.textAlign = "right";
  ctx.font = "32px Inter, sans-serif";
  ctx.fillStyle = "#9CA3AF";
  ctx.fillText("Ежемесячный платёж:", CANVAS_WIDTH - cardPadding - 30, cardY + 60);

  ctx.font = "bold 56px Inter, sans-serif";
  ctx.fillStyle = "white";
  ctx.fillText(
    `${formatCurrency(propertyData.monthlyPayment)} ₽`,
    CANVAS_WIDTH - cardPadding - 30,
    cardY + 120
  );

  // Bank rate
  ctx.font = "28px Inter, sans-serif";
  ctx.fillStyle = "#9CA3AF";
  ctx.textAlign = "left";
  ctx.fillText(
    `Ставка: ${propertyData.bankRate || 0}%`,
    cardPadding + 30,
    cardY + 220
  );

  // Floor plan overlay (positioned over background image, transparent background)
  if (floorPlan) {
    try {
      const planImg = await loadImage(floorPlan);
      
      // Use custom position if provided, otherwise use default
      const planWidth = floorPlanPosition?.width || 480;
      const planHeight = floorPlanPosition?.height || 320;
      const planX = floorPlanPosition?.x || (CANVAS_WIDTH - planWidth - 60);
      const planY = floorPlanPosition?.y || 700;
      
      // No border around floor plan
      
      // Draw plan image directly without background
      const { x, y, width, height } = calculateImageFit(planImg, planWidth - 20, planHeight - 20);
      ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
      ctx.shadowBlur = 10;
      ctx.drawImage(planImg, planX + 10 + x, planY + 10 + y, width, height);
      ctx.shadowBlur = 0;
    } catch (error) {
      console.error("Failed to load floor plan:", error);
    }
  }

  // Bottom info with better visibility
  const bottomY = CANVAS_HEIGHT - 180;
  ctx.font = "bold 32px Inter, sans-serif";
  
  // Add text shadow for better readability
  ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  
  ctx.fillStyle = "white";
  ctx.textAlign = "left";
  ctx.fillText(
    `Первый взнос: ${formatCurrency(propertyData.initialPayment)} ₽`,
    cardPadding + 30,
    bottomY
  );

  ctx.textAlign = "right";
  ctx.fillText(
    `Стоимость: ${formatCurrency(propertyData.totalCost)} ₽`,
    CANVAS_WIDTH - cardPadding - 30,
    bottomY
  );
  
  // Reset shadow
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Bank logo with better visibility
  ctx.textAlign = "right";
  ctx.font = "bold 36px Inter, sans-serif";
  ctx.fillStyle = "white";
  ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.fillText(
    bankLogos[propertyData.selectedBank] || "БАНК НЕ УКАЗАН",
    CANVAS_WIDTH - cardPadding - 30,
    bottomY + 70
  );
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    
    img.src = url;
  });
}

function calculateImageFit(
  img: HTMLImageElement,
  containerWidth: number,
  containerHeight: number
): { x: number; y: number; width: number; height: number } {
  const imgAspect = img.width / img.height;
  const containerAspect = containerWidth / containerHeight;

  let width, height, x, y;

  if (imgAspect > containerAspect) {
    // Image is wider than container
    width = containerWidth;
    height = containerWidth / imgAspect;
    x = 0;
    y = (containerHeight - height) / 2;
  } else {
    // Image is taller than container
    width = containerHeight * imgAspect;
    height = containerHeight;
    x = (containerWidth - width) / 2;
    y = 0;
  }

  return { x, y, width, height };
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ru-RU").format(amount);
}
