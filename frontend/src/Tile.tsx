import React, { Fragment } from 'react';
import logo from './logo.svg';
import './Tile.css';
import Card from 'react-bootstrap/Card'
import { PersonFill } from 'react-bootstrap-icons';

export enum TileVariant {
  Default = 'tile-default',
  Unknown = 'tile-unknown',
  Wrong = 'tile-wrong',
  Contains = 'tile-contains',
  Right = 'tile-right',
   
}

export type TileProps = {
  letter: string
  variant: TileVariant
}

function Tile(props: TileProps) {
  return (
    <Card className={ "tile text-nowrap " + props.variant }>
      <Card.Body>
        <Card.Text>
          <div className="overlay">
            { props.letter.toString() == " " ?
              <Fragment>&nbsp;</Fragment> :
              props.letter.toString()
            }
          </div>
          <PersonFill className="person mb-1"/>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Tile;
