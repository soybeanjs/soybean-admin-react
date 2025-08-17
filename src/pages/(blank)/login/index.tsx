import { loginModuleRecord } from '@/constants/app';
import { useInitAuth } from '@/features/auth/auth';
import { useFormRules } from '@/features/form';

type AccountKey = 'admin' | 'super' | 'user';

interface Account {
  key: AccountKey;
  label: string;
  password: string;
  userName: string;
}

type LoginParams = Pick<Account, 'password' | 'userName'>;

const INITIAL_VALUES = {
  password: '123456',
  userName: 'Soybean'
};

const PwdLogin = () => {
  const { t } = useTranslation();

  const { loading, toLogin } = useInitAuth();

  const [form] = AForm.useForm<LoginParams>();

  const navigate = useNavigate();

  const {
    formRules: { pwd, userName: userNameRules }
  } = useFormRules();

  const accounts: Account[] = [
    {
      key: 'super',
      label: t('page.login.pwdLogin.superAdmin'),
      password: '123456',
      userName: 'Super'
    },
    {
      key: 'admin',
      label: t('page.login.pwdLogin.admin'),
      password: '123456',
      userName: 'Admin'
    },
    {
      key: 'user',
      label: t('page.login.pwdLogin.user'),
      password: '123456',
      userName: 'User'
    }
  ];

  function handleAccountLogin(account: Account) {
    toLogin(account);
  }

  function goCodeLogin() {
    navigate('code-login');
  }

  function goRegister() {
    navigate('register');
  }

  function goResetPwd() {
    navigate('reset-pwd');
  }

  useKeyPress('enter', () => {
    form.submit();
  });

  return (
    <>
      <h3 className="text-18px text-primary font-medium">{t('page.login.pwdLogin.title')}</h3>
      <AForm
        className="pt-24px"
        form={form}
        initialValues={INITIAL_VALUES}
        onFinish={toLogin}
      >
        <AForm.Item
          name="userName"
          rules={userNameRules}
        >
          <AInput />
        </AForm.Item>

        <AForm.Item
          name="password"
          rules={pwd}
        >
          <AInput.Password autoComplete="password" />
        </AForm.Item>
        <ASpace
          className="w-full"
          direction="vertical"
          size={24}
        >
          <div className="flex-y-center justify-between">
            <ACheckbox>{t('page.login.pwdLogin.rememberMe')}</ACheckbox>

            <AButton
              type="text"
              onClick={goResetPwd}
            >
              {t('page.login.pwdLogin.forgetPassword')}
            </AButton>
          </div>
          <AButton
            block
            htmlType="submit"
            loading={loading}
            shape="round"
            size="large"
            type="primary"
          >
            {t('common.confirm')}
          </AButton>
          <div className="flex-y-center justify-between gap-12px">
            <AButton
              block
              className="flex-1"
              onClick={goCodeLogin}
            >
              {t(loginModuleRecord['code-login'])}
            </AButton>
            <AButton
              block
              className="flex-1"
              onClick={goRegister}
            >
              {t(loginModuleRecord.register)}
            </AButton>
          </div>
          <ADivider className="!m-0 !text-14px !text-#666">{t('page.login.pwdLogin.otherAccountLogin')}</ADivider>
          <div className="flex-center gap-12px">
            {accounts.map(item => {
              return (
                <AButton
                  key={item.key}
                  type="primary"
                  onClick={() => handleAccountLogin(item)}
                >
                  {item.label}
                </AButton>
              );
            })}
          </div>
        </ASpace>
      </AForm>
    </>
  );
};

export const handle = {
  constant: true,
  i18nKey: 'route.(blank)_login',
  title: 'login'
};

export default PwdLogin;
