import Link from "next/link";
import CommonsLayout from "./(commons)/layout";

// Sits outside the (commons) group, so it borrows that layout to keep the nav.
export default function NotFound() {
  return (
    <CommonsLayout>
      <h1>Not here</h1>
      <p className="muted">
        That page doesn&apos;t exist, or the listing has closed. <Link href="/opportunities">See current opportunities</Link>.
      </p>
    </CommonsLayout>
  );
}
