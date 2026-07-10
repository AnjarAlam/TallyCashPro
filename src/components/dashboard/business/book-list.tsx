// components/dashboard/books-list.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookText, Calendar, Plus } from "lucide-react";

interface Book {
  id: string;
  name: string;
  createdAt: string;
  balance: number;
  cashIn: number;
  cashOut: number;
}

interface BooksListProps {
  books: Book[];
  onAddBook?: () => void;
  onBookClick?: (book: Book) => void;
}

export function BooksList({ books, onAddBook, onBookClick }: BooksListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Add Book Card */}
      <Card 
        className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer"
        onClick={onAddBook}
      >
        <CardContent className="flex flex-col items-center justify-center h-40 p-6">
          <Plus className="w-8 h-8 text-muted-foreground mb-2" />
          <CardTitle className="text-lg text-center">Add Book</CardTitle>
          <CardDescription className="text-center mt-2">
            Create a new book for your business
          </CardDescription>
        </CardContent>
      </Card>

      {/* Book Cards */}
      {books.map((book) => (
        <Card 
          key={book.id} 
          className="group hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onBookClick?.(book)}
        >
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookText className="w-5 h-5 text-primary" />
                  {book.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3" />
                  Created {book.createdAt}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Current Balance */}
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">CURRENT BALANCE</p>
              <p className="text-2xl font-bold text-primary">${book.balance}</p>
            </div>

            {/* Cash In/Out Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-green-600">
                  <span className="text-lg">↑</span>
                  <span className="text-sm font-medium">Cash In</span>
                </div>
                <p className="text-xl font-semibold">${book.cashIn}</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-red-600">
                  <span className="text-lg">↓</span>
                  <span className="text-sm font-medium">Cash Out</span>
                </div>
                <p className="text-xl font-semibold">${book.cashOut}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1">
                View Details
              </Button>
              <Button variant="outline" size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}