"use client";

import type React from "react";
import { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import type { Resource } from "@/types/resources";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { CloseIcon } from "@/components/icons/CloseIcon";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  onAddResource: () => void;
  onRemoveResource: (resourceId: string) => void;
  selectedResources: Resource[];
  isLoading: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSubmit,
  onAddResource,
  onRemoveResource,
  selectedResources,
  isLoading,
  placeholder = "Ask AI anything..."
}: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSubmit(input.trim());
      // setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="rounded-3xl border border-border bg-background overflow-hidden">
        {/* Selected Resources */}
        {selectedResources.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2 p-2 border-b border-border">
            {selectedResources.map((resource) => (
              <div
                key={resource.id}
                className="flex items-center gap-2 bg-accent rounded-lg px-2 py-1 h-9 relative"
              >
                <div className="h-6 w-6 overflow-hidden flex-shrink-0">
                  <Image
                    src={resource.imageUrl || "/placeholder.svg"}
                    alt={resource.title}
                    width={24}
                    height={24}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col flex-grow min-w-0 pr-6">
                  <span className="text-[10px] leading-normal text-muted-foreground uppercase">
                    {resource.type}
                  </span>
                  <span className="text-[13px]  font-bold leading-normal truncate max-w-40">
                    {resource.title}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onRemoveResource(resource.id);
                  }}
                  className="absolute top-1 right-1 hover:text-muted-foreground"
                >
                  <CloseIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : null}
        {/* Input Area */}
        <div className="flex flex-col items-center p-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full flex-grow bg-background border-0 focus:outline-none focus:ring-0 placeholder-muted-foreground text-xs sm:text-sm pt-2 resize-none"
            disabled={isLoading}
          />
          <div className="flex items-center justify-between w-full">
            <button
              type="button"
              className="flex gap-2 items-center text-[13px] font-semibold"
              onClick={onAddResource}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-accent hover:bg-accent/80 transition-colors">
                <PlusIcon className="fill-foreground" />
              </div>
              Add resource
            </button>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center shrink-0 disabled:bg-accent disabled:cursor-not-allowed"
            >
              <ArrowRightIcon
                fill={
                  isLoading || !input.trim()
                    ? "rgba(161, 161, 161, 1)"
                    : "#052E16"
                }
              />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
