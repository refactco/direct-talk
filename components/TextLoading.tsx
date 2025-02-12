function TextLoading() {
  return (
    <div className="text-xs sm:text-sm text-muted-foreground animate-pulse flex items-center">
      <div className="mr-1 h-0.5 w-0.5 sm:h-1.5 sm:w-1.5 bg-muted-foreground rounded-full animate-bounce"></div>
      <div
        className="mr-1 h-0.5 w-0.5 sm:h-1.5 sm:w-1.5 bg-muted-foreground rounded-full animate-bounce"
        style={{ animationDelay: "0.2s" }}
      ></div>
      <div
        className="mr-2 h-0.5 w-0.5 sm:h-1.5 sm:w-1.5 bg-muted-foreground rounded-full animate-bounce"
        style={{ animationDelay: "0.4s" }}
      ></div>
      AI is thinking...
    </div>
  );
}

export default TextLoading;
