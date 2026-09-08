import { notFound } from "next/navigation";
import { getDemoUserOnce } from "@/lib/store";
import { PublicPage } from "@/components/public/PublicPage";

export function generateStaticParams() {
  const demo = getDemoUserOnce();
  return [{ slug: demo.username }];
}

export default function PublicPageRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return params.then(({ slug }) => {
    const demo = getDemoUserOnce();
    const page = demo.page;

    if (!page || page.slug !== slug) {
      notFound();
    }

    return <PublicPage page={page} user={demo} />;
  });
}
