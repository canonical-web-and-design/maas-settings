import type { APIError } from "@/app/base/types";
import type { EventError } from "@/app/store/types/state";

type FlattenedError = string | null;

const flattenErrors = <E>(errors: E): FlattenedError => {
  if (Array.isArray(errors)) {
    return errors.join(" ");
  }
  return typeof errors === "string" ? errors : null;
};

const parseJSONError = (jsonError: string): FlattenedError => {
  try {
    const parsedError = JSON.parse(jsonError);
    if (typeof parsedError === "object") {
      const errorEntries = Object.entries(parsedError);
      const isAllError =
        errorEntries.length === 1 && errorEntries[0][0] === "__all__";
      return isAllError
        ? flattenErrors(errorEntries[0][1])
        : errorEntries
            .map(([key, value]) => `${key}: ${flattenErrors(value)}`)
            .join(" ");
    }
    return flattenErrors(parsedError);
  } catch {
    return jsonError;
  }
};

const formatObjectError = (
  errors: Record<string, unknown>,
  errorKey?: string
): FlattenedError => {
  if (errorKey && errorKey in errors) {
    return flattenErrors(errors[errorKey]);
  }
  const errorEntries = Object.entries(errors);
  return errorEntries.length > 0
    ? errorEntries
        .map(([key, value]) => `${key}: ${flattenErrors(value)}`)
        .join(" ")
    : null;
};

const parseObjectError = (
  errors: Record<string, unknown>,
  errorKey?: string
): FlattenedError => {
  if (Array.isArray(errors)) {
    return errors.join(" ");
  }
  if (errors instanceof Error) {
    return errors.message;
  }
  if (typeof errors === "object" && errors !== null) {
    return formatObjectError(errors, errorKey);
  }
  return null;
};

const parseHtmlToText = (htmlContent: string): string | null => {
  const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

  if (bodyMatch) {
    const bodyContent = bodyMatch[1];
    const strippedText = bodyContent
      // Remove all HTML tags from the body content
      .replace(/<[^>]+>/g, "")
      // Collapse multiple consecutive whitespace characters into a single space
      .replace(/\s+/g, " ")
      // Trim any leading or trailing whitespace from the resulting text
      .trim();

    return strippedText || null;
  }

  // Return the original content if the body tag is not found
  return htmlContent;
};

type ErrorFormatter = (errors: any, errorKey?: string) => FlattenedError;

type ErrorTypeFormat = "string" | "object" | "html";

const errorTypeFormatters: Record<ErrorTypeFormat, ErrorFormatter> = {
  string: parseJSONError,
  object: parseObjectError,
  html: parseHtmlToText,
};

export type ErrorType<E = null, I = any, K extends keyof I = any> =
  | APIError<E>
  | EventError<I, E, K>
  | Error;

/**
 * Formats errors of different types into a single string.
 * @param errors - The errors to format, which can be a string, array, object, or JSON string.
 * @param errorKey - The optional key to extract the error from if the errors are an object.
 * @returns The formatted error message or null if no errors are provided.
 */
export const formatErrors = <E, I, K extends keyof I>(
  errors?: ErrorType<E, I, K>,
  errorKey?: string
): FlattenedError => {
  if (!errors) {
    return null;
  }

  const isHTMLContent = (content: string): boolean => {
    return /<\/?[a-z][\s\S]*>/i.test(content);
  };

  const getErrorType = (errors: ErrorType<E, I, K>): ErrorTypeFormat => {
    if (typeof errors === "string" && isHTMLContent(errors)) {
      return "html";
    }
    return (typeof errors) in errorTypeFormatters
      ? (typeof errors as ErrorTypeFormat)
      : "string";
  };

  const errorType = getErrorType(errors);
  const formatErrorsByType = errorTypeFormatters[errorType];

  if (formatErrorsByType) {
    return formatErrorsByType(errors, errorKey);
  }

  return null;
};
