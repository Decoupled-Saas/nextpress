"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditPage from "./edit-page";

interface Page {
  id: string;
  title: string;
  content: string;
  slug: string;
  status: "draft" | "published";
}

export default function PagesContent() {
  const [pages, setPages] = useState<Page[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<Page | null>(null);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch("/api/pages");
      if (!response.ok) {
        throw new Error("Failed to fetch pages");
      }
      const data = await response.json();
      setPages(data);
    } catch (error) {
      console.error("Error fetching pages:", error);
      toast.error("Failed to fetch pages");
    }
  };

  const handleDelete = async () => {
    if (!pageToDelete) return;

    try {
      const response = await fetch(`/api/pages/${pageToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete page");
      }

      setIsDeleteDialogOpen(false);
      setPageToDelete(null);
      fetchPages();
      toast.success("Page deleted successfully");
    } catch (error) {
      console.error("Error deleting page:", error);
      toast.error("Failed to delete page");
    }
  };

  const handleSave = async (page: Page) => {
    try {
      const url = page.id ? `/api/pages/${page.id}` : "/api/pages";
      const method = page.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(page),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${page.id ? "update" : "create"} page`);
      }

      fetchPages();
      setEditingPage(null);
      setIsCreating(false);
      toast.success(`Page ${page.id ? "updated" : "created"} successfully`);
    } catch (error) {
      console.error(`Error ${page.id ? "updating" : "creating"} page:`, error);
      toast.error(`Failed to ${page.id ? "update" : "create"} page`);
    }
  };

  if (editingPage || isCreating) {
    return (
      <EditPage
        page={editingPage}
        onSave={handleSave}
        onCancel={() => {
          setEditingPage(null);
          setIsCreating(false);
        }}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Pages</h2>
        <Button onClick={() => setIsCreating(true)}>Create New Page</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.map((page) => (
            <TableRow key={page.id}>
              <TableCell>{page.title}</TableCell>
              <TableCell>{page.slug}</TableCell>
              <TableCell>{page.status}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => setEditingPage(page)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setPageToDelete(page);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this page? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
