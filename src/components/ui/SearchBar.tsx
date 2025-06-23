import { useState, useEffect } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

interface SearchBarProps {
    placeholder?: string;
    onSearch: (query: string) => void;
    className?: string;
    showButton?: boolean;
    realTime?: boolean;
}

export const SearchBar = ({
    placeholder = "Search products...",
    onSearch,
    className = "",
    showButton = true,
    realTime = true
}: SearchBarProps) => {
    const [query, setQuery] = useState("");

    // Real-time search with debouncing
    useEffect(() => {
        if (realTime) {
            const timeoutId = setTimeout(() => {
                onSearch(query);
            }, 300); // 300ms debounce

            return () => clearTimeout(timeoutId);
        }
    }, [query, onSearch, realTime]);

    const handleSearch = () => {
        onSearch(query);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const clearSearch = () => {
        setQuery("");
        onSearch("");
    };

    return (
        <div className={`flex gap-2 ${className}`}>
            <div className="relative flex-1">
                <Input
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                    startContent={
                        <div className="text-default-400">
                            🔍
                        </div>
                    }
                    endContent={
                        query && (
                            <button
                                onClick={clearSearch}
                                className="text-default-400 hover:text-default-600 transition-colors"
                                aria-label="Clear search"
                            >
                                ✕
                            </button>
                        )
                    }
                />
            </div>
            {showButton && (
                <Button
                    color="primary"
                    onPress={handleSearch}
                    className="px-6"
                    isDisabled={!query.trim()}
                >
                    Search
                </Button>
            )}
        </div>
    );
};
