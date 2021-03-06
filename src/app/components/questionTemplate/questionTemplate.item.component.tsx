import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  CardActions
} from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import { QuestionTemplate } from '../../../api/classes/questionTemplate.class';

const useStyles = makeStyles(theme => ({
  cardContent: {
    paddingTop: '0 !important'
  }
}));

interface OwnProps {
  questionTemplate: QuestionTemplate;
  onDelete?: (questionTemplateId: string) => void;
  onUpdate?: (questionTemplate: QuestionTemplate) => void;
}

type Props = OwnProps;

const QuestionTemplateItemComponent: React.FunctionComponent<Props> = props => {
  const classes = useStyles();

  const { questionTemplate } = props;

  const handleEdit = () => props.onUpdate && props.onUpdate(questionTemplate);

  const handleDelete = () =>
    props.onDelete && props.onDelete(questionTemplate.id);

  return (
    <Card>
      <CardHeader title={questionTemplate.name} />
      <CardContent className={classes.cardContent}>
        {questionTemplate.clientPath}
      </CardContent>
      {(props.onDelete || props.onUpdate) && (
        <CardActions>
          {props.onUpdate && (
            <IconButton aria-label="edit" onClick={handleEdit}>
              <EditIcon />
            </IconButton>
          )}
          {props.onDelete && (
            <IconButton
              aria-label="delete"
              onClick={handleDelete}
              style={{ marginLeft: 'auto' }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </CardActions>
      )}
    </Card>
  );
};

export const QuestionTemplateItem = QuestionTemplateItemComponent;
