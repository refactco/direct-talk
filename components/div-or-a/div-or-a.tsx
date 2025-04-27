export const DivOrA = ({ href, ...props }: any) => {
  if (href) {
    return <a href={href} {...props} />;
  }

  return <div {...props} />;
};
