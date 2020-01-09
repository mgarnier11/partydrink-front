import React from 'react';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import { ThunkDispatch } from 'redux-thunk';
import { Link } from 'react-router-dom';
import { makeStyles, Hidden, CssBaseline } from '@material-ui/core';

import { UserState } from '../../../store/user/types';
import { RootState } from '../../../store';
import { logout } from '../../../store/user/actions';
import { ToolbarMobile } from './toolbar.mobile';

const useStyles = makeStyles(theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 101
  }
}));

interface OwnProps {}

interface DispatchProps {
  logout: () => void;
}

interface StateProps {
  userState: UserState;
}

type Props = StateProps & OwnProps & DispatchProps;

const HeaderComponent: React.FunctionComponent<Props> = (props: Props) => {
  const classes = useStyles();

  const user = props.userState.user;

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <ToolbarMobile user={user} />
    </AppBar>
  );
};

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return {
    userState: states.userState
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    logout: async () => {
      await dispatch(logout());
    }
  };
};

export const Header = connect<StateProps, DispatchProps, OwnProps, RootState>(
  mapStateToProps,
  mapDispatchToProps
)(HeaderComponent);

export const headerHeight = 64;
