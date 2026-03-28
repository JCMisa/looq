"use client";

const CurrentYear = () => {
  return (
    <p className="text-sm text-muted-foreground">
      © {new Date().getFullYear()} Looq. All rights reserved.
    </p>
  );
};

export default CurrentYear;
