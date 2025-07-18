import { resetTheme, settingsJson } from '@/features/theme';

const ConfigOperation = () => {
  const { t } = useTranslation();

  const themeSettingsJson = useAppSelector(settingsJson);
  const dispatch = useAppDispatch();
  const { copy } = useCopy();

  function formatConfigText() {
    const reg = /"\w+":/g;

    return themeSettingsJson.replace(reg, match => match.replace(/"/g, ''));
  }

  async function handleCopy() {
    const text = formatConfigText();
    const success = await copy(text);

    if (success) {
      window.$message?.success(t('theme.configOperation.copySuccessMsg'));
    } else {
      window.$message?.error(t('theme.configOperation.copyFailedMsg'));
    }
  }

  function handleReset() {
    dispatch(resetTheme());

    setTimeout(() => {
      window.$message?.success(t('theme.configOperation.resetSuccessMsg'));
    }, 50);
  }

  return (
    <div className="flex justify-between">
      <AButton
        danger
        onClick={handleReset}
      >
        {t('theme.configOperation.resetConfig')}
      </AButton>
      <AButton
        type="primary"
        onClick={handleCopy}
      >
        {t('theme.configOperation.copyConfig')}
      </AButton>
    </div>
  );
};

export default ConfigOperation;
