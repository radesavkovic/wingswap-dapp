import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FixedSizeList as List } from 'react-window';
import { Box, Flex, Label, Switch, Text } from 'theme-ui';

import useListUrls from '../../../hooks/useListUrls';
import { actions } from '../../../reducers';
import { useAppDispatch } from '../../../reducers/hooks';
import ListLogo from '../../logos/list.logo';

interface Props {
  active: boolean;
  onClose: () => void;
}

export default function ManageList(props: Props) {
  const { active } = props;
  const { t } = useTranslation(['app']);
  const listUrls = useListUrls();
  const dispatch = useAppDispatch();

  const _onSwitch = useCallback(
    (url: string, value: boolean) => {
      dispatch(actions.list.updateActiveList({ url, active: value }));
    },
    [dispatch],
  );

  const Row = useCallback(
    ({ index, data, style }) => {
      const list = data[index];

      return (
        <Flex variant="styles.row" key={list.url} style={style} sx={{ alignItems: 'space-between', cursor: 'default' }}>
          <Label htmlFor={list.url} sx={{ flex: 1, alignItems: 'center', cursor: 'pointer' }}>
            <ListLogo logoURI={list.logoURI} />
            <Flex sx={{ flexDirection: 'column', marginLeft: 12 }}>
              <Text sx={{ fontWeight: 'medium' }}>{list.name}</Text>
              <Text
                sx={{
                  fontSize: 0,
                  lineHeight: 0,
                  fontWeight: 'medium',
                  color: 'white.100',
                  fontFamily: 'body',
                }}
              >
                {t('app:token_count' as any, { count: list.tokenCount })}
              </Text>
            </Flex>
          </Label>
          <Box>
            <Switch
              id={list.url}
              defaultChecked={list.active}
              onChange={({ target }) => {
                _onSwitch(target.id, target.checked);
              }}
            />
          </Box>
        </Flex>
      );
    },
    [_onSwitch, t],
  );

  return (
    <Flex
      sx={{
        display: active ? 'flex' : 'none',
      }}
    >
      <List
        height={480}
        itemCount={listUrls.length}
        itemSize={60}
        width={'100%'}
        itemData={listUrls}
        sx={{
          '&::-webkit-scrollbar-track': {},
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: '8px',
            height: '80px',
            backgroundColor: 'rgba(92, 92, 92, 0.3)',
          },
        }}
      >
        {Row}
      </List>
    </Flex>
  );
}
