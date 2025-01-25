"use client";

import { ModalBodyBase } from "@/components/modal/modal-body";
import { ModalCloseButtonBase } from "@/components/modal/modal-close";
import { ModalContainerBase } from "@/components/modal/modal-container";
import { ModalContentBase } from "@/components/modal/modal-content";
import { ModalFooterBase } from "@/components/modal/modal-footer";
import { ModalHeaderBase } from "@/components/modal/modal-header";
import { ModalOverlayBase } from "@/components/modal/modal-overlay";
import { ModalRoot } from "@/components/modal/modal-root";
import { createStyleContext } from "@/components/style-context";
import { modal } from "@dreamy-ui/system/recipes";

const { withProvider, withContext } = createStyleContext(modal);

/**
 * Modal component
 *
 * @See Docs https://dreamy-ui.com/docs/components/modal
 */
export const Modal = withProvider(ModalRoot);
export const ModalOverlay = withContext(ModalOverlayBase, "overlay");
export const ModalContainer = withContext(ModalContainerBase, "container");
export const ModalContent = withContext(ModalContentBase, "content");
export const ModalHeader = withContext(ModalHeaderBase, "header");
export const ModalBody = withContext(ModalBodyBase, "body");
export const ModalFooter = withContext(ModalFooterBase, "footer");
export const ModalCloseButton = withContext(ModalCloseButtonBase, "close");
