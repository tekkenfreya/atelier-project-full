import type { CustomerOrder, OrderItemExtended } from "@/features/customer/types";

interface PrintSheetProps {
  order: CustomerOrder;
}

interface CategoryPreset {
  volumeMl: number;
  color: string;
  instruction: string;
}

const CATEGORY_PRESETS: Record<string, CategoryPreset> = {
  Cleanser: {
    volumeMl: 150,
    color: "#a8c4b0",
    instruction: "Massage onto damp skin morning and evening. Rinse thoroughly.",
  },
  Serum: {
    volumeMl: 30,
    color: "#c9a0a0",
    instruction: "Apply 3–4 drops to clean skin before moisturizer.",
  },
  Moisturizer: {
    volumeMl: 50,
    color: "#d7b89c",
    instruction: "Apply to face and neck morning and evening.",
  },
};

const FALLBACK_PRESET: CategoryPreset = {
  volumeMl: 50,
  color: "#c4b8a8",
  instruction: "Use as directed.",
};

const COMPANY = {
  name: "Kyrill",
  responsible: "Kyrill Skincare",
  address: "Brussels, Belgium",
};

export default function PrintSheet({ order }: PrintSheetProps) {
  const items = (order.items as OrderItemExtended[]) ?? [];
  const customerName = order.shipping_name ?? "";

  return (
    <div className="admin-print-sheet" data-order-id={order.id}>
      {items.map((item, idx) => {
        const preset = CATEGORY_PRESETS[item.category] ?? FALLBACK_PRESET;
        return (
          <div key={`${order.id}-${idx}`} className="admin-print-label">
            <div
              className="admin-print-label__side"
              style={{ backgroundColor: preset.color }}
            >
              <div className="admin-print-label__brand">{COMPANY.name}</div>
              <div className="admin-print-label__company">
                <div>{COMPANY.responsible}</div>
                <div>{COMPANY.address}</div>
              </div>
            </div>
            <div className="admin-print-label__body">
              <div className="admin-print-label__category">{item.category}</div>
              <div className="admin-print-label__product">{item.productName}</div>
              {customerName && (
                <div className="admin-print-label__customer">for {customerName}</div>
              )}
              <div className="admin-print-label__instruction">
                {preset.instruction}
              </div>
              <div className="admin-print-label__footer">
                <span className="admin-print-label__code">
                  {item.productId.slice(0, 4).toUpperCase()}
                </span>
                <span>{preset.volumeMl} ml</span>
              </div>
            </div>
            <div
              className="admin-print-label__barcode"
              style={{ backgroundColor: preset.color }}
            >
              <div className="admin-print-label__barcode-bars" aria-hidden />
              <div className="admin-print-label__barcode-code">
                {item.productId.slice(0, 8).toUpperCase()}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
