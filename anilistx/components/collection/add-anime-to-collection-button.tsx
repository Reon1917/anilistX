'use client';

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import { AddAnimeDialog } from "@/components/collection/add-anime-dialog";

interface AddAnimeToCollectionButtonProps extends ButtonProps {
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

export function AddAnimeToCollectionButton({
  variant = "default",
  size = "default",
  className,
  ...props
}: AddAnimeToCollectionButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setDialogOpen(true)}
        className={className}
        {...props}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Anime
      </Button>
      
      <AddAnimeDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
      />
    </>
  );
} 