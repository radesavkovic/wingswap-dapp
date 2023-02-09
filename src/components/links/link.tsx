import { ForwardRefExoticComponent, FunctionComponent, PropsWithoutRef, RefAttributes } from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { Link as ThemeUILink, LinkProps as ThemedUILinkProps } from 'theme-ui';

type ForwardRef<T, P> = ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>;

type CombinedProps = ThemedUILinkProps & RouterLinkProps;

const FinalLink: ForwardRef<HTMLAnchorElement, CombinedProps> = ThemeUILink;

const Link: FunctionComponent<CombinedProps> = ({ children, ...props }: CombinedProps) => {
  return (
    <FinalLink as={RouterLink} {...props}>
      {children}
    </FinalLink>
  );
};

export default Link;
