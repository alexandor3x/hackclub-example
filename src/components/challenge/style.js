import { Flex } from '@hackclub/design-system'
import styled, { css } from 'styled-components'

export const Byline = Flex.withComponent('p').extend`
  margin: 0 !important;
  line-height: 1;
  color: ${({ theme }) => theme.colors.muted};
  font-size: ${({ theme }) => theme.fontSizes[1]}px;
  -webkit-user-select: none; /* Chrome/Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+ */
  max-width: 100%;
`
export const CommentByline = Byline.extend`
  flex-direction: ${props => (props.mine ? 'row-reverse' : 'row')};
`
export const QuotedCommentByline = Byline.extend`
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space[1] / 2}px;

  svg {
    margin-right: ${({ theme }) => theme.space[1]}px;
  }

  > p {
    margin: 0 !important;
  }
`

export const commentStyle = css`
  font-size: ${({ theme }) => theme.fontSizes[1]}px;
  line-height: 1.375;
  vertical-align: middle;
  white-space: pre-line;
  word-wrap: break-word;
  word-break: break-word;

  > :first-child {
    margin-top: 0 !important;
  }
  > :last-child {
    margin-bottom: 0 !important;
  }

  > * {
    font-size: inherit;
  }

  > p {
    margin-top: ${({ theme }) => theme.space[1]}px;
    margin-bottom: ${({ theme }) => theme.space[1]}px;
  }

  a {
    text-decoration: underline;
  }

  h1,
  h2,
  h3 {
    margin-top: 0;
    margin-bottom: ${({ theme }) => theme.space[2]}px;
  }

  ol,
  ul {
    padding-left: ${({ theme }) => theme.space[3]}px;
  }

  blockquote {
    border-left: 2px solid currentColor;
    padding-left: ${({ theme }) => theme.space[2]}px;
    margin-left: 0;
  }

  li {
    margin-top: ${({ theme }) => theme.space[1]}px;
    margin-bottom: ${({ theme }) => theme.space[1]}px;
  }

  strong {
    font-weight: ${({ theme }) => theme.bold};
  }

  img {
    max-width: 100%;
  }
`
