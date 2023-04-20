import React, { FC } from 'react';
import { GridLoading } from '../../GridLoading';

interface IProps {
  children: any; //JSX.Element
  isLoading: boolean;
  loaderStyles?: any;
}

export const WithLoading: FC<IProps> = ({ children, isLoading, loaderStyles }) =>
  isLoading ? <GridLoading styles={loaderStyles} /> : children;
