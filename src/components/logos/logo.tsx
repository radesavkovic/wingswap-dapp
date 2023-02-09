import { useState } from 'react';
import { FiSlash } from 'react-icons/fi';
import { Flex, Image, ImageProps } from 'theme-ui';

const BAD_SRCS: { [tokenAddress: string]: true } = {};

export interface Props extends Pick<ImageProps, 'style' | 'alt' | 'className'> {
  srcs: Array<string | undefined>;
}

export default function Logo({ className, srcs, alt, ...rest }: Props) {
  const [, refresh] = useState<number>(0);

  const src: string | undefined = srcs.filter((src) => !!src).find((src) => !BAD_SRCS[src!]);

  if (src) {
    return (
      <Flex className={className} sx={{ overflow: 'clip' }}>
        <Image
          {...rest}
          alt={alt}
          src={src}
          onError={() => {
            if (src) BAD_SRCS[src] = true;
            refresh((i) => i + 1);
          }}
        />
      </Flex>
    );
  }

  return <FiSlash className={className} {...rest} sx={{ color: 'dark.200' }} />;
}
