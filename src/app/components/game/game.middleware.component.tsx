import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { RootState } from '../../../store';
import { Loading } from '../utils/loading.component';
import { GameState } from '../../../store/game/types';
import { GameActions } from '../../../store/game/actions';
import { GameStatus } from '../../../api/classes/game.class';

import { UserState } from '../../../store/user/types';
import { GameNotFound } from '../../pages/games/game.notFound.page';
import { GameCreated } from '../../pages/games/game.created.page';
import { GameStarted } from '../../pages/games/game.started.page';

interface RouteParams {
  displayId: string;
}

interface OwnProps {}

interface DispatchProps {
  gameGetByDisplayId: (displayId: string) => Promise<any>;
}

interface StateProps {
  gameState: GameState;
  userState: UserState;
}

type Props = StateProps & OwnProps & DispatchProps & RouteComponentProps;

interface ComponentState {}

const GameMiddlewareComponent: React.FunctionComponent<Props> = (
  props: Props
) => {
  const { displayId } = props.match.params as any;

  const { game, loading: gameLoading } = props.gameState;
  const { user, loading: userLoading } = props.userState;

  useEffect(() => {
    if (displayId) props.gameGetByDisplayId(displayId);
  }, []); // eslint-disable-line

  if (game && user) {
    if (
      game.creator.id === user.id ||
      game.users.map((u) => u.id).includes(user.id)
    ) {
      switch (game.status) {
        case GameStatus.created:
          return <GameCreated displayId={displayId} />;
        case GameStatus.started:
          return <GameStarted displayId={displayId} />;
        case GameStatus.finished:
          return <>finished</>;
      }
    } else {
      return <GameNotFound displayId={displayId} />;
    }
  } else if (gameLoading || userLoading) return <Loading />;
  else if (!game) return <GameNotFound displayId={displayId} />;
  return <>An error occured</>;
};

const mapStateToProps = (states: RootState, ownProps: OwnProps): StateProps => {
  return {
    gameState: states.gameState,
    userState: states.userState,
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    gameGetByDisplayId: async (displayId: string) => {
      dispatch(GameActions.gameGetByDisplayId(displayId));
    },
  };
};

export const GameMiddleware = withRouter(
  connect<StateProps, DispatchProps, OwnProps, RootState>(
    mapStateToProps,
    mapDispatchToProps
  )(GameMiddlewareComponent)
);
