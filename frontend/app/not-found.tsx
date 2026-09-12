import Link from "next/link";
export default function NotFound() {
  return (
    <div className="empty-state">
      <h1>This lab is not here.</h1>
      <p>Choose a guided exercise from the learning path.</p>
      <Link className="button primary" href="/curriculum">
        Explore the labs
      </Link>
    </div>
  );
}
