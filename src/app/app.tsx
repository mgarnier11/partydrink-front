import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, withRouter } from 'react-router';
import { RouteComponentProps } from 'react-router';

import Header from './components/header/header.component';
//import Loading from './components/loading/loading.component';
import Login from './pages/auth/login/login.page';
import Register from './pages/auth/register/register.page';
import Home from './pages/home/home.page';
import Guard from './components/guard/guard.component';
import Footer from './components/footer/footer.component';
import Error from './components/error/error.component';
import Success from './components/success/success.component';
import Roles from './pages/roles/roles.page';
import QuestionTypes from './pages/questionTypes/question-types.page';
import Questions from './pages/questions/questions.page';
import QuestionNewComponent from './components/question/new/question.new.component';

import { RootState } from '../store';
import { ThunkDispatch } from 'redux-thunk';
import { relog } from '../store/user/actions';
import { CssBaseline, Fab, Modal } from '@material-ui/core';
import { roleGetAll } from '../store/role/actions';
import { UserState } from '../store/user/types';
import apiHandler from '../api/apiHandler';
import { Question } from '../api/classes/question.class';
import apiEventsHandler from '../store/apiEventsHandler';

interface OwnProps {}

interface DispatchProps {
  relog: () => void;
  roleGetAll: () => void;
}

interface StateProps {
  userState: UserState;
}

type Props = StateProps & OwnProps & DispatchProps & RouteComponentProps;

interface State {
  questionModalOpen: boolean;
  gameModalOpen: boolean;
}

class App extends React.Component<Props, State> {
  /**
   *
   */
  constructor(props: Props) {
    super(props);
    this.state = {
      questionModalOpen: false,
      gameModalOpen: false
    };

    this.props.relog();
    this.props.roleGetAll();

    this.questionSuccessfullyCreated = this.questionSuccessfullyCreated.bind(
      this
    );
  }

  componentDidMount() {
    apiHandler.questionService.ownEvents.on(
      'created',
      this.questionSuccessfullyCreated
    );

    apiEventsHandler.bindEvents();
  }

  componentWillUnmount() {
    apiHandler.questionService.ownEvents.off(
      'created',
      this.questionSuccessfullyCreated
    );

    apiEventsHandler.unbindEvents();
  }

  questionSuccessfullyCreated(q: Question) {
    this.closeQuestionModal();
  }

  openQuestionModal = () => {
    this.setState({ questionModalOpen: true });
  };

  closeQuestionModal = () => {
    this.setState({ questionModalOpen: false });
  };

  openGameModal = () => {
    this.setState({ gameModalOpen: true });
  };

  closeGameModal = () => {
    this.setState({ gameModalOpen: false });
  };

  renderQuestionFAB() {
    return (
      <Fab
        variant="extended"
        className="floating-action-button"
        color="primary"
        onClick={this.openQuestionModal}
      >
        New Question
      </Fab>
    );
  }

  renderGameFAB() {
    return (
      <Fab
        variant="extended"
        className="floating-action-button"
        color="primary"
        onClick={this.openGameModal}
      >
        New Game
      </Fab>
    );
  }

  renderQuestionModal() {
    return (
      <Modal
        open={this.state.questionModalOpen}
        onClose={this.closeQuestionModal}
      >
        <QuestionNewComponent />
      </Modal>
    );
  }

  renderGameModal() {
    return (
      <Modal open={this.state.gameModalOpen} onClose={this.closeGameModal}>
        <>Game Modal</>
      </Modal>
    );
  }

  renderFAB() {
    switch (this.props.location.pathname) {
      case '/questions':
        return this.renderQuestionFAB();

      default:
        return this.renderGameFAB();
    }
  }

  render() {
    const user = this.props.userState.user;
    return (
      <React.Fragment>
        <CssBaseline />

        <Header />
        <Switch>
          <Guard minimalPermission={NaN} path="/home" redirect="/">
            <Home />
          </Guard>
          <Guard minimalPermission={0} path="/questions" redirect="/">
            <Questions />
          </Guard>
          <Guard minimalPermission={100} path="/roles" redirect="/home">
            <Roles />
          </Guard>
          <Guard minimalPermission={100} path="/questionTypes" redirect="/home">
            <QuestionTypes />
          </Guard>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/register">
            <Register />
          </Route>
          <Redirect from="*" to="/home" />
        </Switch>
        <Footer />
        <Success />
        <Error />
        {user ? (
          <>
            {this.renderFAB()}
            {this.renderQuestionModal()}
            {this.renderGameModal()}
          </>
        ) : (
          <></>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return {
    userState: states.userState.user
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    relog: async () => {
      await dispatch(relog(false));
    },
    roleGetAll: async () => {
      await dispatch(roleGetAll());
    }
  };
};

export default withRouter(
  connect<StateProps, DispatchProps, OwnProps, RootState>(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
