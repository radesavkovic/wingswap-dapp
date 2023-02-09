import { useTranslation } from 'react-i18next';
import { Flex, Heading } from 'theme-ui';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <Flex sx={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'background' }}>
      <Heading variant="styles.h1">{t('not_found')}</Heading>
    </Flex>
  );
}
