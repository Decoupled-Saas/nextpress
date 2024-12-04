"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import MarkdownEditor from "@/components/markdown-editor";

interface Post {
  id?: string;
  title: string;
  content: string;
  status: "draft" | "published";
  slug: string;
}

interface EditPostProps {
  post: Post | null;
  onSave: (post: Post) => void;
  onCancel: () => void;
}

export default function EditPost({ post, onSave, onCancel }: EditPostProps) {
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [status, setStatus] = useState<"draft" | "published">(
    post?.status || "draft",
  );
  const [slug, setSlug] = useState(post?.slug || "");

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setStatus(post.status);
      setSlug(post.slug);
    }
  }, [post]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: post?.id,
      title,
      content,
      status,
      slug,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">
          {post ? "Edit Post" : "Create New Post"}
        </h2>
        <Button onClick={onCancel}>Cancel</Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          <Button type="submit">{post ? "Update Post" : "Create Post"}</Button>
        </div>
      </form>
    </div>
  );
}
