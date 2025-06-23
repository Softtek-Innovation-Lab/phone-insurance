import { useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

interface FilterOptions {
    category: string;
    priceRange: string;
    sortBy: string;
    minPrice: string;
    maxPrice: string;
}

interface AdvancedFiltersProps {
    onFilterChange: (filters: FilterOptions) => void;
    onReset: () => void;
    isOpen: boolean;
    onToggle: () => void;
}

const categories = [
    { key: "all", label: "All Categories" },
    { key: "mobile", label: "Mobile Devices" },
    { key: "computers", label: "Computers" },
    { key: "tablets", label: "Tablets" },
    { key: "wearables", label: "Wearables" },
    { key: "other", label: "Other Devices" }
];

const priceRanges = [
    { key: "all", label: "All Prices" },
    { key: "0-500", label: "$0 - $500" },
    { key: "500-1000", label: "$500 - $1,000" },
    { key: "1000-2000", label: "$1,000 - $2,000" },
    { key: "2000+", label: "$2,000+" }
];

const sortOptions = [
    { key: "name", label: "Name (A-Z)" },
    { key: "name-desc", label: "Name (Z-A)" },
    { key: "price-asc", label: "Price (Low to High)" },
    { key: "price-desc", label: "Price (High to Low)" },
    { key: "popularity", label: "Most Popular" }
];

export const AdvancedFilters = ({ onFilterChange, onReset, isOpen, onToggle }: AdvancedFiltersProps) => {
    const [filters, setFilters] = useState<FilterOptions>({
        category: "all",
        priceRange: "all",
        sortBy: "name",
        minPrice: "",
        maxPrice: ""
    });

    const handleFilterChange = (key: keyof FilterOptions, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleReset = () => {
        const resetFilters: FilterOptions = {
            category: "all",
            priceRange: "all",
            sortBy: "name",
            minPrice: "",
            maxPrice: ""
        };
        setFilters(resetFilters);
        onReset();
    };

    return (
        <div className="mb-6">
            <Button
                variant="bordered"
                onPress={onToggle}
                className="mb-4"
                startContent={
                    <span className="text-lg">
                        {isOpen ? "▼" : "▶"}
                    </span>
                }
            >
                Advanced Filters
            </Button>

            {isOpen && (
                <Card className="animate-fade-in">
                    <CardBody className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Category
                                </label>
                                <Select
                                    selectedKeys={[filters.category]}
                                    onSelectionChange={(keys) => handleFilterChange('category', Array.from(keys)[0] as string)}
                                >
                                    {categories.map(cat => (
                                        <SelectItem key={cat.key}>{cat.label}</SelectItem>
                                    ))}
                                </Select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Price Range
                                </label>
                                <Select
                                    selectedKeys={[filters.priceRange]}
                                    onSelectionChange={(keys) => handleFilterChange('priceRange', Array.from(keys)[0] as string)}
                                >
                                    {priceRanges.map(range => (
                                        <SelectItem key={range.key}>{range.label}</SelectItem>
                                    ))}
                                </Select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Sort By
                                </label>
                                <Select
                                    selectedKeys={[filters.sortBy]}
                                    onSelectionChange={(keys) => handleFilterChange('sortBy', Array.from(keys)[0] as string)}
                                >
                                    {sortOptions.map(option => (
                                        <SelectItem key={option.key}>{option.label}</SelectItem>
                                    ))}
                                </Select>
                            </div>

                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Min Price
                                    </label>
                                    <Input
                                        type="number"
                                        placeholder="$0"
                                        value={filters.minPrice}
                                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Max Price
                                    </label>
                                    <Input
                                        type="number"
                                        placeholder="$5000"
                                        value={filters.maxPrice}
                                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                color="danger"
                                variant="light"
                                onPress={handleReset}
                            >
                                Reset Filters
                            </Button>
                            <div className="text-sm text-gray-500 flex items-center">
                                Showing filtered results
                            </div>
                        </div>
                    </CardBody>
                </Card>
            )}
        </div>
    );
};
