import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Container, Card, CardContent, CardHeader } from '@material-ui/core';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import {
  withStyles,
  WithStyles,
  createStyles,
  StyleRules,
  Theme
} from '@material-ui/core/styles';

import { RootState } from '../../../store';
import { addError } from '../../../store/errors/actions';
import { DummyUser } from '../../../api/classes/dummyUser.class';
import { DummyUserForm } from './dummy.form.component';

const styles = (theme: Theme): StyleRules =>
  createStyles({
    root: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: 'fit-content',
      outline: 'none',
      maxWidth: '400px'
    },
    card: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      textAlign: 'center'
    },
    cardContent: {
      padding: '0',
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1)
    }
  });

interface OwnProps {
  dummyUserCreate: (dummyUser: DummyUser) => void;
}

interface DispatchProps {
  addError: (error: any) => void;
}

interface StateProps {}

type Props = StateProps &
  OwnProps &
  DispatchProps &
  WithSnackbarProps &
  WithStyles<typeof styles>;

interface ComponentState {}

class DummyUserNewComponent extends React.Component<Props, ComponentState> {
  /**
   *
   */
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  handleSubmit = (dummyUser: DummyUser) => {
    this.props.dummyUserCreate(dummyUser);
  };

  render() {
    const classes = this.props.classes;

    return (
      <Container component="main" className={classes.root} tabIndex={-1}>
        <Card className={classes.card} raised={true}>
          <CardHeader title="Create a new temporary user" />
          <CardContent className={classes.cardContent}>
            <DummyUserForm
              dummyUser={DummyUser.New({})}
              onSubmit={this.handleSubmit}
              buttonText="Create user"
            />
          </CardContent>
        </Card>
      </Container>
    );
  }
}

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return {};
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    addError: async (error: any) => {
      await dispatch(addError(error));
    }
  };
};

export const DummyUserNew = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  RootState
>(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(
  withStyles(styles)(withSnackbar(DummyUserNewComponent))
);
