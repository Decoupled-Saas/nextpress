"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import MarkdownEditor from "@/components/markdown-editor";

interface Page {
  id: string;
  title: string;
  content: string;
  slug: string;
  status: "draft" | "published";
}

interface EditPageProps {
  page: Page | null;
  onSave: (page: Page) => void;
  onCancel: () => void;
}

export default function EditPage({ page, onSave, onCancel }: EditPageProps) {
  const [title, setTitle] = useState(page?.title || "");
  const [content, setContent] = useState(page?.content || "");
  const [slug, setSlug] = useState(page?.slug || "");
  const [status, setStatus] = useState<"draft" | "published">(
    page?.status || "draft",
  );

  useEffect(() => {
    if (page) {
      setTitle(page.title);
      setContent(page.content);
      setSlug(page.slug);
      setStatus(page.status);
    }
  }, [page]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: page?.id || "",
      title,
      content,
      slug,
      status,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">
          {page ? "Edit Page" : "Create New Page"}
        </h2>
        <Button onClick={onCancel}>Cancel</Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <MarkdownEditor
            initialValue={content}
            onChange={(value) => setContent(value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="status"
            checked={status === "published"}
            onCheckedChange={(checked) =>
              setStatus(checked ? "published" : "draft")
            }
          />
          <Label htmlFor="status">Published</Label>
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{page ? "Update Page" : "Create Page"}</Button>
        </div>
      </form>
    </div>
  );
}
