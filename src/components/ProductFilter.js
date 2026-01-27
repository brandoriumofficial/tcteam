export default function ProductFilter({ search, setSearch, sort, setSort }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded-lg w-full md:w-1/3"
      />
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="border p-2 rounded-lg"
      >
        <option value="">Sort By</option>
        <option value="price_low">Price: Low to High</option>
        <option value="price_high">Price: High to Low</option>
        <option value="rating">Rating</option>
      </select>
    </div>
  );
}
