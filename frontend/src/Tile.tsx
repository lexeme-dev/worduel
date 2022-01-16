import React from 'react';
import logo from './logo.svg';
import './Tile.css';
import Card from 'react-bootstrap/Card'

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
    <div className={ "tile " + props.variant }>
      <Card className="inner-tile">
        <Card.Body>
          <Card.Text>
            { props.letter.toString() }
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Tile;
