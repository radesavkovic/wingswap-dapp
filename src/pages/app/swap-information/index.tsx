import { Flex } from 'theme-ui';

import SelectTokenModal from '../../../components/modals/select-token.modal';
import { mediaWidthTemplates } from '../../../constants/media';
import usePairRoute from '../../../hooks/usePairRoute';
import ContentView from './content-view';
import MenuView from './menu-view';

export default function SwapInformationPage() {
  const {
    disabledCurrency,
    isSelectingCurrency,
    toggleSelectCurrencyA,
    toggleSelectCurrencyB,
    onSelectCurrency,
    currencies: { CURRENCY_A: currencyA, CURRENCY_B: currencyB },
  } = usePairRoute(['from', 'to']);

  return (
    <Flex sx={{ flex: 1, backgroundColor: 'dark.500' }}>
      <MenuView
        sx={{ width: '35%', ...mediaWidthTemplates.upToMedium({ width: 'unset' }) }}
        pair={{
          from: currencyA,
          to: currencyB,
        }}
        toggleSelectCurrencyA={toggleSelectCurrencyA}
        toggleSelectCurrencyB={toggleSelectCurrencyB}
      />
      <ContentView
        sx={{
          width: '65%',
          ...mediaWidthTemplates.upToMedium({
            flex: 1,
            width: 'unset',
            marginLeft: 0,
          }),
        }}
        pair={{
          from: currencyA,
          to: currencyB,
        }}
      />
      <SelectTokenModal
        active={isSelectingCurrency}
        title="Select token"
        disabledToken={disabledCurrency}
        onClose={onSelectCurrency}
      />
    </Flex>
  );
}
