import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import { IconButton, Typography, Button } from '@material-ui/core';
import HouseIcon from '@material-ui/icons/Home';
import { Link } from 'react-router-dom';

import { User } from '../../../api/classes/user.class';
import { renderUser } from './header.component';

interface OwnProps {
  user: User;
  classes: any;
  logout: any;
}

type Props = OwnProps;

const ToolbarDesktopComponent: React.FunctionComponent<Props> = (
  props: Props
) => {
  const { user, classes } = props;

  const admin = () =>
    user.role.permissionLevel >= 100 ? (
      <>
        <Link to="/roles" className={classes.button}>
          <Button className={classes.button}>Roles</Button>
        </Link>
        <Link to="/questionTypes" className={classes.button}>
          <Button className={classes.button}>Question Types</Button>
        </Link>
      </>
    ) : (
      <></>
    );

  const notIDVice = () =>
    !user.isIDVice() && (
      <Link to="/questions" className={classes.button}>
        <Button className={classes.button}>Questions</Button>
      </Link>
    );

  return (
    <Toolbar>
      <IconButton
        edge="start"
        className={classes.button}
        color="inherit"
        aria-label="menu"
      >
        <Link to="/home" className={classes.button}>
          <HouseIcon />
        </Link>
      </IconButton>
      <Typography variant="h6" className={classes.title}>
        <Link to="/home" className={classes.button}>
          Name not defined
        </Link>

        {notIDVice()}
        {admin()}
      </Typography>
      {renderUser(props)}
    </Toolbar>
  );
};

export const ToolbarDesktop = ToolbarDesktopComponent;
