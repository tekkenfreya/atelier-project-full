import type { ResolvedExtract } from "@/features/atlas/extracts";

interface ExtractsProps {
  extracts: ResolvedExtract[];
}

export default function Extracts({ extracts }: ExtractsProps) {
  return (
    <section className="account-section">
      <header className="account-section__header">
        <h1 className="account-section__title">Extracts</h1>
        <p className="account-section__subtitle">
          Botanical extracts in your current ritual.
        </p>
      </header>
      {extracts.length === 0 ? (
        <p className="account-empty-inline">No extracts to display.</p>
      ) : (
        <table className="account-table">
          <thead>
            <tr>
              <th>Extract</th>
              <th>Origin</th>
              <th>Countries</th>
            </tr>
          </thead>
          <tbody>
            {extracts.map((e) => (
              <tr key={e.ingredientName}>
                <td>{e.ingredientName}</td>
                <td>{e.origin.region ?? e.origin.country}</td>
                <td>{e.allCountries.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
