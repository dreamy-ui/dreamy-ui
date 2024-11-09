"use client";

import { AlertDescriptionBase } from "@/components/alert/alert-description";
import { AlertIconBase } from "@/components/alert/alert-icon";
import { AlertRoot } from "@/components/alert/alert-root";
import { AlertTitleBase } from "@/components/alert/alert-title";
import { createStyleContext } from "@/components/style-context";
import { alert } from "@dreamy-ui/system/recipes";

const { withProvider, withContext } = createStyleContext(alert);

/**
 * Alert component
 *
 * @See Docs https://dream-ui.com/docs/components/alert
 */
export const Alert = withProvider(AlertRoot, "root");
export const AlertIcon = withContext(AlertIconBase, "icon");
export const AlertTitle = withContext(AlertTitleBase, "title");
export const AlertDescription = withContext(AlertDescriptionBase, "description");
