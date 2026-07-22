import 'react';

declare global {
  namespace React.JSX {
    interface IntrinsicElements {
      'phantom-ui': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          loading?: boolean;
          animation?: 'shimmer' | 'pulse' | 'none';
          count?: number;
          'count-gap'?: number;
          reveal?: number;
          children?: React.ReactNode;
        },
        HTMLElement
      >;
    }
  }
}
