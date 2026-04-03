import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  author: string;
  image?: string;
}

export interface PostMeta extends PostFrontmatter {
  slug: string;
}

export interface Post extends PostMeta {
  content: string;
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const posts = files.map((file): PostMeta => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
    const { data } = matter(raw);
    const slug = file.replace(/\.(mdx|md)$/, "");
    return {
      slug,
      title: String(data.title ?? slug),
      description: String(data.description ?? ""),
      date: String(data.date ?? ""),
      author: String(data.author ?? ""),
      image: data.image ? String(data.image) : undefined,
    };
  });

  // Newest first
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export const getPost = cache(function getPost(slug: string): Post | null {
  // Reject slugs that could escape BLOG_DIR via path traversal (e.g. "../../etc/passwd")
  if (!/^[\w-]+$/.test(slug)) return null;

  // Try .mdx then .md — operate directly and handle ENOENT instead of pre-checking existence
  let raw: string;
  try {
    raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.mdx`), "utf8");
  } catch {
    try {
      raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.md`), "utf8");
    } catch {
      return null;
    }
  }

  const { data, content } = matter(raw);

  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    date: String(data.date ?? ""),
    author: String(data.author ?? ""),
    image: data.image ? String(data.image) : undefined,
    content,
  };
});
