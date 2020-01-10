import * as lodash from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import {
  Typography,
  Select,
  MenuItem,
  Button,
  TextField,
  InputLabel,
  FormControl,
  Input,
  Chip,
  Checkbox,
  ListItemText,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  ButtonGroup,
  Box,
  Hidden
} from '@material-ui/core';
import {
  withStyles,
  WithStyles,
  createStyles,
  StyleRules,
  Theme
} from '@material-ui/core/styles';
import BarChartIcon from '@material-ui/icons/BarChart';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { RouterProps, RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { RootState } from '../../../store';
import { addError } from '../../../store/errors/actions';
import { Game, GameStatus } from '../../../api/classes/game.class';
import { GameTypesState } from '../../../store/gameTypes/types';
import { GamesState } from '../../../store/games/types';
import { QuestionTypesState } from '../../../store/questionTypes/types';
import { QuestionType } from '../../../api/classes/questionType.class';
import { GameType } from '../../../api/classes/gameType.class';
import { Helper } from '../../../helper';
import { GameActions } from '../../../store/game/actions';
import { yesNoController } from '../dialogs/yesno.component';
import { GamesActions } from '../../../store/games/actions';

const styles = (theme: Theme): StyleRules =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column'
    },
    filterButtons: {
      marginLeft: 'auto',
      marginRight: 'auto',
      marginBottom: 6
    },
    myButton: {
      paddingRight: 11,
      paddingLeft: 11
    }
  });

interface OwnProps {
  games: Game[];
  title?: string;
  isAdmin?: boolean;
}

interface DispatchProps {
  gameGetByDisplayId: (displayId: string) => Promise<any>;
  gameRemove: (gameId: string) => Promise<any>;
}

interface StateProps {
  gameTypesState: GameTypesState;
}

type Props = StateProps &
  OwnProps &
  DispatchProps &
  RouteComponentProps &
  WithStyles<typeof styles>;

interface FilterGameStatus {
  key: string;
  value: GameStatus;
}

interface ComponentState {
  filteredGameStatus: FilterGameStatus[];
}

class GameListComponent extends React.Component<Props, ComponentState> {
  private static allGameStatus: FilterGameStatus[] = Object.entries(
    GameStatus
  ).map(g => {
    return { key: g[0], value: g[1] };
  });

  public static defaultProps = {
    isAdmin: false
  };

  /**
   *
   */
  constructor(props: Props) {
    super(props);

    this.state = {
      filteredGameStatus: GameListComponent.allGameStatus
    };
  }

  handleGameClick = (displayId: string) => {
    this.props.gameGetByDisplayId(displayId);
    this.props.history.push(`/games/${displayId}`);
  };

  handleDeleteClick = (gameId: string) => {
    yesNoController!
      .present({
        title: 'Are you sure you want to delete this game ?',
        acceptText: 'Yes',
        denyText: 'No'
      })
      .then(() => {
        this.props.gameRemove(gameId);
      })
      .catch(error => {
        //this.props.addError(error);
      });
  };

  toggleGameTypeFilter = (name: string) => {
    const filteredGameStatus = [...this.state.filteredGameStatus];

    let gameStatusIndex = filteredGameStatus.findIndex(g => g.key === name);

    if (gameStatusIndex === -1) {
      filteredGameStatus.push(
        GameListComponent.allGameStatus.find(g => g.key === name)!
      );
    } else {
      filteredGameStatus.splice(gameStatusIndex, 1);
    }

    this.setState({ filteredGameStatus: filteredGameStatus });
  };

  renderStatusButton(game: Game) {
    const getIcon = (status: GameStatus) => {
      switch (status) {
        case GameStatus.created:
          return this.props.isAdmin ? (
            <EditIcon color="primary" />
          ) : (
            <PlayArrowIcon color="primary" />
          );
        case GameStatus.started:
          return <PlayArrowIcon color="primary" />;
        case GameStatus.finished:
          return <BarChartIcon color="primary" />;
      }
    };

    return (
      <IconButton
        className={this.props.classes.myButton}
        onClick={() => this.handleGameClick(game.displayId)}
      >
        {getIcon(game.status)}
      </IconButton>
    );
  }

  renderDeleteButton(game: Game) {
    return (
      <IconButton
        className={this.props.classes.myButton}
        color="primary"
        onClick={() => this.handleDeleteClick(game.id)}
      >
        <DeleteIcon />
      </IconButton>
    );
  }

  render() {
    const classes = this.props.classes;

    const { title, games, isAdmin } = this.props;
    const { filteredGameStatus } = this.state;

    return (
      <Box className={classes.root}>
        {title && (
          <Typography variant="h5" align="center">
            {title}
          </Typography>
        )}

        <ButtonGroup variant="contained" className={classes.filterButtons}>
          {GameListComponent.allGameStatus.map(gameStatus => (
            <Button
              key={gameStatus.key}
              color={
                filteredGameStatus.includes(gameStatus) ? 'primary' : 'default'
              }
              onClick={() => this.toggleGameTypeFilter(gameStatus.key)}
            >
              {gameStatus.value}
            </Button>
          ))}
        </ButtonGroup>
        <TableContainer component="div">
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Name</TableCell>
                <Hidden xsDown>
                  <TableCell>Nb Players</TableCell>
                </Hidden>

                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {games
                .filter(g =>
                  filteredGameStatus.find(gs => gs.value === g.status)
                )
                .map(game => {
                  return (
                    <TableRow key={game.id}>
                      <TableCell>{game.displayId}</TableCell>
                      <TableCell>{game.name}</TableCell>
                      <Hidden xsDown>
                        <TableCell>{game.allUsers.length}</TableCell>
                      </Hidden>
                      <TableCell align="center" padding="none">
                        {this.renderStatusButton(game)}
                        {isAdmin && this.renderDeleteButton(game)}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }
}

const mapStateToProps = (states: RootState): StateProps => {
  return {
    gameTypesState: states.gameTypesState
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>
): DispatchProps => {
  return {
    gameGetByDisplayId: async (displayId: string) => {
      return await dispatch(GameActions.gameGetByDisplayId(displayId));
    },
    gameRemove: async (gameId: string) => {
      return await dispatch(GamesActions.gameRemove(gameId));
    }
  };
};

export const GameList = withRouter(
  connect<StateProps, DispatchProps, OwnProps, RootState>(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { forwardRef: true }
  )(withStyles(styles)(GameListComponent))
);
