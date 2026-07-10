"use client";

import React from "react";
import PreviousPage from "./previous-page";

export type compConfigProps = Array<{
  position: "left" | "center" | "right";
  comp: React.ReactNode;
}>;

interface TitleHeaderProps {
  /**
   * Whether to show the "Previous Page" button.
   * @default false
   */
  showPreviousPage?: boolean;
  /**
   * The main title of the dashboard header.
   */
  headerTitle?: string;
  /**
   * Position index of the header title within the left components.
   * For example, 0 means before any left components, 1 means after first left component, etc.
   * @default 0
   */
  headerTitlePosition?: number;
  /**
   * An array of components to render in the header, along with their desired position.
   */
  components?: compConfigProps;

  showTitle?: boolean;
}

/**
 * A responsive dashboard navigation header component.
 * It includes a main title, an optional "Previous Page" button,
 * and allows for custom React elements to be placed in left, center, or right sections.
 * The header title position within left components can be controlled via headerTitlePosition prop.
 */
export default function TitleHeader({
  showPreviousPage = false,
  headerTitle,
  headerTitlePosition = 0,
  components = [],
}: TitleHeaderProps) {
  const leftComponents = components.filter((c) => c.position === "left");
  const centerComponents = components.filter((c) => c.position === "center");
  const rightComponents = components.filter((c) => c.position === "right");

  // Split left components into before and after title based on headerTitlePosition
  const leftComponentsBeforeTitle = leftComponents.slice(
    0,
    headerTitlePosition
  );
  const leftComponentsAfterTitle = leftComponents.slice(headerTitlePosition);

  return (
    <header className="flex h-16 justify-start items-center gap-4 border-b bg-background sm:bg-transparent sm:static sm:h-auto sm:border-0 w-full p-4 md:p-6">
      {/* Left section: Previous Page button and custom left components */}
      <div className="flex items-center gap-4">
        {showPreviousPage && <PreviousPage />}

        {/* Render left components that should appear before the title */}
        {leftComponentsBeforeTitle.map((item, index) => (
          <React.Fragment key={index}>{item.comp}</React.Fragment>
        ))}

        {/* The header title */}
        {headerTitle && (
          <h1 className="text-lg font-bold md:text-2xl">{headerTitle}</h1>
        )}

        {/* Render left components that should appear after the title */}
        {leftComponentsAfterTitle.map((item, index) => (
          <React.Fragment key={index}>{item.comp}</React.Fragment>
        ))}
      </div>

      {/* Center section: Custom center components */}
      <div className="flex-1 text-center flex flex-col items-center justify-center">
        {centerComponents.map((item, index) => (
          <React.Fragment key={index}>{item.comp}</React.Fragment>
        ))}
      </div>

      {/* Right section: Custom right components */}
      <div className="flex items-center gap-2 ml-auto">
        {rightComponents.map((item, index) => (
          <React.Fragment key={index}>{item.comp}</React.Fragment>
        ))}
      </div>
    </header>
  );
}
