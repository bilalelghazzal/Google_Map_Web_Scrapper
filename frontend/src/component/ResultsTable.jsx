export default function ResultsTable({ results }) {
  if (results.length === 0) return null;

  return (
    <table className="results-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Phone</th>
        </tr>
      </thead>
      <tbody>
        {results.map((item, index) => (
          <tr key={index}>
            <td>{item.title}</td>
            <td>{item.phone}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
