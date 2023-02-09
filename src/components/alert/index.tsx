import { useMemo } from 'react';
import { FiX } from 'react-icons/fi';
import { Alert as ThemeUIAlert, Button, Flex, Text } from 'theme-ui';

import { mediaWidthTemplates } from '../../constants/media';

type Link = {
  url: string;
  text: string;
};
type Button = {
  text: string;
  onClick: () => void;
};

const isLink = (action: any): action is Link => {
  if (action?.url) {
    return true;
  }
  return false;
};

const isButton = (action: any): action is Button => {
  if (action?.onClick) {
    return true;
  }
  return false;
};

type Props = {
  variant: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
  action?: Link | Button;
  onClose: () => void;
  visible: boolean;
};

export default function Alert({ variant, title, description, action, onClose, visible }: Props) {
  const Icon = useMemo(() => {
    switch (variant) {
      case 'success':
        return SuccessIcon;
      case 'error':
        return ErrorIcon;
      case 'info':
        return InfoIcon;
      default:
        return WarningIcon;
    }
  }, [variant]);
  return (
    <ThemeUIAlert
      variant="primary"
      className={visible ? 'alert-animate-in' : 'alert-animate-out'}
      sx={{
        position: 'relative',
      }}
    >
      <Flex
        sx={{
          alignItems: 'center',
        }}
      >
        <Flex sx={{ flexShrink: 0, lineHeight: 1 }}>
          <Icon />
        </Flex>
        <Flex sx={{ marginLeft: 16, flexDirection: 'column' }}>
          <Text variant="body300" sx={{ color: 'white.400' }}>
            {title}
          </Text>
          {description && (
            <Text variant="body100" sx={{ color: 'white.300', marginTop: '4px' }}>
              {description}
            </Text>
          )}
          {isLink(action) && (
            <a
              href={action.url}
              target="_blank"
              rel="noreferrer"
              sx={{
                marginTop: '4px',
                textDecoration: 'none',
              }}
            >
              <Text
                variant="body300"
                sx={{
                  color: 'mint.300',
                }}
              >
                {action.text}
              </Text>
            </a>
          )}
          {isButton(action) && (
            <Button
              variant="link"
              onClick={action.onClick}
              sx={{
                alignSelf: 'flex-start',
                marginTop: '4px',
              }}
            >
              <Text variant="body300">{action.text}</Text>
            </Button>
          )}
        </Flex>
        <Flex
          sx={{
            cursor: 'pointer',
            width: 27,
            height: 27,
            background: 'rgba(22, 18, 72, 0.9)',
            borderRadius: '50%',
            justifyContent: 'center',
            alignItems: 'center',
            flexShrink: 0,
            color: 'white.400',
            position: 'absolute',
            top: 0,
            left: 0,
            transform: 'translate(-50%, -50%)',
            ...mediaWidthTemplates.upToExtraSmall({
              position: 'static',
              transform: 'none',
              color: 'rgba(22, 18, 72, 0.85)',
              marginLeft: '8px',
              backgroundColor: 'white.200',
            }),
          }}
          onClick={onClose}
        >
          <FiX />
        </Flex>
      </Flex>
    </ThemeUIAlert>
  );
}

const SuccessIcon = () => {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16 3C8.83187 3 3 8.83187 3 16C3 23.1681 8.83187 29 16 29C23.1681 29 29 23.1681 29 16C29 8.83187 23.1681 3 16 3ZM22.7656 11.6431L14.3656 21.6431C14.1792 21.8652 13.9055 21.9954 13.6156 22H13.5988C13.3153 21.9999 13.0452 21.8795 12.8556 21.6688L9.25562 17.6688C8.87676 17.2669 8.89538 16.634 9.29722 16.2551C9.69907 15.8763 10.332 15.8949 10.7108 16.2967C10.7214 16.308 10.7318 16.3195 10.7419 16.3313L13.5725 19.4763L21.2344 10.3569C21.5957 9.93916 22.2272 9.89343 22.6449 10.2547C23.0541 10.6087 23.1076 11.2239 22.7656 11.6431L22.7656 11.6431Z"
        fill="#3BEBCE"
      />
    </svg>
  );
};

const ErrorIcon = () => {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M28.0669 24.9425L17.415 5.16125C16.66 3.75875 14.6488 3.75875 13.8932 5.16125L3.24191 24.9425H3.24191C2.71827 25.9151 3.0822 27.128 4.05477 27.6516C4.34531 27.808 4.67005 27.8902 5.00003 27.8906H26.3057C27.4102 27.8908 28.3058 26.9955 28.3059 25.8909C28.306 25.5599 28.2238 25.234 28.0669 24.9425V24.9425ZM15.6544 24.8281C14.9641 24.8281 14.4044 24.2685 14.4044 23.5781C14.4044 22.8878 14.9641 22.3281 15.6544 22.3281C16.3448 22.3281 16.9044 22.8878 16.9044 23.5781C16.9044 24.2685 16.3448 24.8281 15.6544 24.8281ZM17.0119 12.2563L16.6532 19.8813C16.6532 20.4335 16.2054 20.8813 15.6532 20.8813C15.1009 20.8813 14.6532 20.4335 14.6532 19.8813L14.2944 12.2594V12.2594C14.2612 11.51 14.8418 10.8757 15.5911 10.8425C15.6068 10.8418 15.6225 10.8414 15.6382 10.8413H15.6513C16.4017 10.8409 17.0104 11.4489 17.0107 12.1993C17.0108 12.2195 17.0103 12.2398 17.0094 12.26L17.0119 12.2563Z"
        fill="#FD8383"
      />
    </svg>
  );
};

const InfoIcon = () => {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16 3.5C9.1075 3.5 3.5 9.1075 3.5 16C3.5 22.8925 9.1075 28.5 16 28.5C22.8925 28.5 28.5 22.8925 28.5 16C28.5 9.1075 22.8925 3.5 16 3.5ZM16 8.625C16.8975 8.625 17.625 9.35254 17.625 10.25C17.625 11.1475 16.8975 11.875 16 11.875C15.1025 11.875 14.375 11.1475 14.375 10.25C14.375 9.35254 15.1025 8.625 16 8.625ZM19 22.75H13.5C12.9477 22.75 12.5 22.3023 12.5 21.75C12.5 21.1977 12.9477 20.75 13.5 20.75H15.25V15.25H14.25C13.6977 15.25 13.25 14.8023 13.25 14.25C13.25 13.6977 13.6977 13.25 14.25 13.25H16.25C16.8023 13.25 17.25 13.6977 17.25 14.25V20.75H19C19.5523 20.75 20 21.1977 20 21.75C20 22.3023 19.5523 22.75 19 22.75Z"
        fill="#18EBFB"
      />
    </svg>
  );
};

const WarningIcon = () => {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M28.067 24.9425L17.4151 5.16125C16.6601 3.75875 14.6488 3.75875 13.8932 5.16125L3.24197 24.9425H3.24197C2.71833 25.9151 3.08226 27.128 4.05483 27.6516C4.34537 27.808 4.67011 27.8902 5.0001 27.8906H26.3057C27.4103 27.8908 28.3058 26.9955 28.306 25.8909C28.306 25.5599 28.2239 25.234 28.067 24.9425V24.9425ZM15.6545 24.8281C14.9641 24.8281 14.4045 24.2685 14.4045 23.5781C14.4045 22.8878 14.9641 22.3281 15.6545 22.3281C16.3448 22.3281 16.9045 22.8878 16.9045 23.5781C16.9045 24.2685 16.3448 24.8281 15.6545 24.8281ZM17.012 12.2563L16.6532 19.8813C16.6532 20.4335 16.2055 20.8813 15.6532 20.8813C15.1009 20.8813 14.6532 20.4335 14.6532 19.8813L14.2945 12.2594V12.2594C14.2613 11.51 14.8419 10.8757 15.5912 10.8425C15.6069 10.8418 15.6225 10.8414 15.6382 10.8413H15.6514C16.4018 10.8409 17.0104 11.4489 17.0108 12.1993C17.0108 12.2195 17.0104 12.2398 17.0095 12.26L17.012 12.2563Z"
        fill="#F18C2F"
      />
    </svg>
  );
};
