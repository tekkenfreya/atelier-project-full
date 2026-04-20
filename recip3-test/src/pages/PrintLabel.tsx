import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Printer } from "lucide-react";

type LabelMode = "bottle" | "temporary";

interface ProductRow {
  id: string;
  name: string;
  category: string | null;
  product_level: string | null;
}

interface CategoryPreset {
  volumes: number[];
  defaultVolume: number;
  defaultColor: string;
}

const CATEGORY_PRESETS: Record<string, CategoryPreset> = {
  Moisturizer: { volumes: [30, 40, 50, 60, 70, 100], defaultVolume: 50, defaultColor: "#d7b89c" },
  Cleanser: { volumes: [50, 100, 120, 150, 170, 200, 250], defaultVolume: 150, defaultColor: "#a8c4b0" },
  Serum: { volumes: [10, 15, 20, 25, 30, 40, 50, 70], defaultVolume: 30, defaultColor: "#c9a0a0" },
};

const FALLBACK_PRESET: CategoryPreset = {
  volumes: [30, 50, 100],
  defaultVolume: 50,
  defaultColor: "#c4b8a8",
};

const COMPANY_INFO = {
  name: "Atelier Rusalka",
  responsiblePerson: "Kyrill Productions BV",
  address: "Brussels, Belgium",
};

const BOTTLE_LABEL_SIZE_MM = { width: 180, height: 60 };
const TEMPORARY_LABEL_SIZE_MM = { width: 40, height: 20 };

const PrintLabel = () => {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<LabelMode>("bottle");
  const [productId, setProductId] = useState<string>("");
  const [customerName, setCustomerName] = useState("");
  const [volume, setVolume] = useState<number>(50);
  const [color, setColor] = useState<string>("#c4b8a8");
  const [instruction, setInstruction] = useState("");
  const [productCode, setProductCode] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("id, name, category, product_level")
          .order("name");
        if (error) throw error;
        if (data) setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === productId),
    [products, productId]
  );

  const preset = useMemo(() => {
    const category = selectedProduct?.category ?? "";
    return CATEGORY_PRESETS[category] ?? FALLBACK_PRESET;
  }, [selectedProduct]);

  useEffect(() => {
    if (!selectedProduct) return;
    setVolume(preset.defaultVolume);
    setColor(preset.defaultColor);
  }, [selectedProduct, preset]);

  const size = mode === "bottle" ? BOTTLE_LABEL_SIZE_MM : TEMPORARY_LABEL_SIZE_MM;

  const pageCss = `
    @media print {
      @page { size: ${size.width}mm ${size.height}mm; margin: 0; }
      body * { visibility: hidden !important; }
      .print-label-sheet, .print-label-sheet * { visibility: visible !important; }
      .print-label-sheet {
        position: fixed !important;
        inset: 0 !important;
        width: ${size.width}mm !important;
        height: ${size.height}mm !important;
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
        border: none !important;
      }
    }
  `;

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      <style dangerouslySetInnerHTML={{ __html: pageCss }} />

      <div className="flex items-center justify-between print-label-hide">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Printing Tool</h1>
          <p className="text-muted-foreground">
            Prototype — generate bottle and temporary labels
          </p>
        </div>
        <Button onClick={handlePrint} disabled={!productId}>
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 print-label-hide">
        <Card>
          <CardHeader>
            <CardTitle>Label Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Label Type</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={mode === "bottle" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMode("bottle")}
                >
                  Bottle Label
                </Button>
                <Button
                  type="button"
                  variant={mode === "temporary" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMode("temporary")}
                >
                  Temporary Label
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="product">Product</Label>
              <Select value={productId} onValueChange={setProductId}>
                <SelectTrigger id="product">
                  <SelectValue placeholder={loading ? "Loading..." : "Select a product"} />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                      {p.category ? ` — ${p.category}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productCode">Product Code</Label>
              <Input
                id="productCode"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                placeholder="e.g. 01F0"
              />
            </div>

            {mode === "bottle" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Elena Petrova"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="volume">Volume (ml)</Label>
                    <Select
                      value={String(volume)}
                      onValueChange={(v) => setVolume(Number(v))}
                    >
                      <SelectTrigger id="volume">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {preset.volumes.map((v) => (
                          <SelectItem key={v} value={String(v)}>
                            {v} ml
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color">Accent Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        id="color"
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="h-9 w-12 cursor-pointer rounded border border-input bg-transparent"
                      />
                      <Input
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instruction">Instruction</Label>
                  <Textarea
                    id="instruction"
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    placeholder="Apply morning and evening to clean skin..."
                    rows={3}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {mode === "bottle" ? (
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Flat wraparound ({BOTTLE_LABEL_SIZE_MM.width}×{BOTTLE_LABEL_SIZE_MM.height}mm)
                  </p>
                  <BottleLabelSheet
                    productName={selectedProduct?.name ?? "—"}
                    category={selectedProduct?.category ?? ""}
                    customerName={customerName}
                    volume={volume}
                    color={color}
                    instruction={instruction}
                    productCode={productCode}
                  />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">On-bottle mockup</p>
                  <BottleMockup
                    productName={selectedProduct?.name ?? "—"}
                    category={selectedProduct?.category ?? ""}
                    customerName={customerName}
                    volume={volume}
                    color={color}
                  />
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Temporary label ({TEMPORARY_LABEL_SIZE_MM.width}×{TEMPORARY_LABEL_SIZE_MM.height}mm)
                </p>
                <TemporaryLabelSheet
                  productCode={productCode}
                  productName={selectedProduct?.name ?? ""}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="print-label-sheet">
        {mode === "bottle" ? (
          <BottleLabelSheet
            printMode
            productName={selectedProduct?.name ?? "—"}
            category={selectedProduct?.category ?? ""}
            customerName={customerName}
            volume={volume}
            color={color}
            instruction={instruction}
            productCode={productCode}
          />
        ) : (
          <TemporaryLabelSheet
            printMode
            productCode={productCode}
            productName={selectedProduct?.name ?? ""}
          />
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .print-label-sheet { display: none; }
            @media print {
              .print-label-hide { display: none !important; }
              .print-label-sheet { display: block; }
            }
          `,
        }}
      />
    </div>
  );
};

interface BottleLabelProps {
  productName: string;
  category: string;
  customerName: string;
  volume: number;
  color: string;
  instruction: string;
  productCode: string;
  printMode?: boolean;
}

const BottleLabelSheet = ({
  productName,
  category,
  customerName,
  volume,
  color,
  instruction,
  productCode,
  printMode = false,
}: BottleLabelProps) => {
  const widthMm = BOTTLE_LABEL_SIZE_MM.width;
  const heightMm = BOTTLE_LABEL_SIZE_MM.height;
  const style: React.CSSProperties = printMode
    ? { width: `${widthMm}mm`, height: `${heightMm}mm` }
    : { aspectRatio: `${widthMm} / ${heightMm}`, width: "100%" };

  return (
    <div
      className="flex border border-border rounded-sm overflow-hidden bg-white text-black"
      style={style}
    >
      <div
        className="flex flex-col justify-between p-3 text-[0.55rem] leading-tight"
        style={{ width: "30%", backgroundColor: color }}
      >
        <div className="font-semibold uppercase tracking-widest text-[0.6rem]">
          {COMPANY_INFO.name}
        </div>
        <div className="opacity-80">
          <div>{COMPANY_INFO.responsiblePerson}</div>
          <div>{COMPANY_INFO.address}</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between p-3">
        <div>
          <div className="text-[0.6rem] uppercase tracking-widest opacity-70">
            {category || "Product"}
          </div>
          <div className="font-serif text-lg leading-tight mt-0.5">{productName}</div>
          {customerName && (
            <div className="text-xs italic mt-1">for {customerName}</div>
          )}
        </div>
        <div className="text-[0.55rem] leading-snug mt-2 whitespace-pre-wrap">
          {instruction || "—"}
        </div>
        <div className="flex justify-between items-end text-[0.55rem] mt-2">
          <span className="font-mono">{productCode || "—"}</span>
          <span>{volume} ml</span>
        </div>
      </div>

      <div
        className="flex flex-col items-center justify-center p-2 text-[0.5rem]"
        style={{ width: "20%", backgroundColor: color, opacity: 0.85 }}
      >
        <div className="font-mono text-[0.5rem] mb-1">BARCODE</div>
        <div
          className="w-full h-6"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, #000 0 1px, transparent 1px 3px, #000 3px 5px, transparent 5px 6px)",
          }}
        />
        <div className="font-mono mt-1 tracking-wider">{productCode || "—"}</div>
      </div>
    </div>
  );
};

interface BottleMockupProps {
  productName: string;
  category: string;
  customerName: string;
  volume: number;
  color: string;
}

const BottleMockup = ({
  productName,
  category,
  customerName,
  volume,
  color,
}: BottleMockupProps) => {
  return (
    <div className="flex justify-center py-4">
      <div className="relative w-36">
        <div
          className="mx-auto w-8 h-6 rounded-t-sm"
          style={{ backgroundColor: "#2b2b2b" }}
        />
        <div
          className="mx-auto w-12 h-3"
          style={{ backgroundColor: "#3a3a3a" }}
        />
        <div
          className="relative w-full rounded-md overflow-hidden border border-neutral-300"
          style={{ height: "220px", backgroundColor: "#f4f1ec" }}
        >
          <div
            className="absolute left-0 right-0 flex items-stretch"
            style={{ top: "25%", bottom: "15%", backgroundColor: color }}
          >
            <div className="flex-1 flex flex-col justify-center px-2 text-[0.5rem] text-black">
              <div className="uppercase tracking-widest opacity-70">
                {category || "Product"}
              </div>
              <div className="font-serif text-[0.75rem] leading-tight">
                {productName}
              </div>
              {customerName && (
                <div className="italic mt-0.5">for {customerName}</div>
              )}
              <div className="mt-1 text-[0.45rem]">{volume} ml</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface TemporaryLabelProps {
  productCode: string;
  productName: string;
  printMode?: boolean;
}

const TemporaryLabelSheet = ({
  productCode,
  productName,
  printMode = false,
}: TemporaryLabelProps) => {
  const widthMm = TEMPORARY_LABEL_SIZE_MM.width;
  const heightMm = TEMPORARY_LABEL_SIZE_MM.height;
  const style: React.CSSProperties = printMode
    ? { width: `${widthMm}mm`, height: `${heightMm}mm` }
    : { aspectRatio: `${widthMm} / ${heightMm}`, width: "12rem" };

  return (
    <div
      className="flex flex-col items-center justify-center border border-dashed border-border bg-white text-black"
      style={style}
    >
      <div className="font-mono text-lg font-bold tracking-wider">
        {productCode || "—"}
      </div>
      {productName && !printMode && (
        <div className="text-[0.55rem] opacity-70 mt-0.5 px-1 text-center truncate max-w-full">
          {productName}
        </div>
      )}
    </div>
  );
};

export default PrintLabel;
