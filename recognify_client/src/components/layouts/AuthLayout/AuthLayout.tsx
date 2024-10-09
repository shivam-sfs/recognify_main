const AuthLayout = ({ children }: childrenType) => {
  return (
    <div className={`g-sidenav-show bg-gray-100 g-sidenav-pinned`}>
      <div className="min-height-300 bg-primary position-fixed w-100"></div>
      {children}
    </div>
  );
};
export default AuthLayout;
