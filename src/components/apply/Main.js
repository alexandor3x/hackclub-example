import React, { Component, Fragment } from 'react'
import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Heading,
  Hide,
  Icon,
  IconButton,
  LargeButton,
  Link as DSLink,
  Text,
  cx
} from '@hackclub/design-system'
import styled from 'styled-components'
import LeaderInvite from 'components/apply/LeaderInvite'
import { clubApplicationSchema } from 'components/apply/ClubApplicationForm'
import Sheet from 'components/Sheet'
import SubmitButton from 'components/apply/SubmitButton'
import Status from 'components/apply/Status'
import Link from 'gatsby-link'
import { timeSince } from 'helpers'
import api from 'api'
import { Modal, CloseButton, Overlay } from 'components/Modal'

const P = props => <Text my={3} {...props} />

const A = DSLink.extend`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`

const Neg = () => <Text.span color="error" bold children="NOT" />

const Title = styled(Heading.h1).attrs({ f: 6 })`
  line-height: 1.25;
`
const MDBreak = Hide.withComponent('br').extend.attrs({
  xs: true,
  sm: true,
  md: true
})``

class ContactModal extends Component {
  state = { open: false }

  toggle = () => this.setState(({ open }) => ({ open: !open }))

  render() {
    const { open } = this.state
    return (
      <Fragment>
        <Button bg="info" onClick={this.toggle} children="Contact us" f={1} />
        {open && (
          <Fragment>
            <Modal w="28rem" align="left" my={4} p={[3, 4]}>
              <CloseButton onClick={this.toggle} />
              <Heading.h2>Contact Us</Heading.h2>
              <Text f={2}>
                Send any questions about the application process to{' '}
                <A to="mailto:applications@hackclub.com">
                  applications@hackclub.com
                </A>.
              </Text>
            </Modal>
            <Overlay onClick={this.toggle} />
          </Fragment>
        )}
      </Fragment>
    )
  }
}

// NOTE(@lachlanjc): for use if/when we have a slideshow experience
// const PrimaryButton = styled(IconButton).attrs({
//   name: 'edit',
//   bg: 'primary',
//   circle: true,
//   size: 36,
//   p: 3
// })`
//   position: absolute;
//   right: 0;
//   bottom: -64px;
//   box-shadow: ${({ theme }) => theme.boxShadows[1]} !important;
//   transition: ${({ theme }) => theme.transition} box-shadow;
//   &:hover,
//   &:focus {
//     box-shadow: ${({ theme }) => theme.boxShadows[2]} !important;
//   }
// `

const Rejected = ({ resetCallback }) => (
  <Box mb={4} align="center">
    <Heading.h2 mb={3}>Unfortunately, you’ve been rejected</Heading.h2>
    <P>
      You can start a new application by clicking{' '}
      <A onClick={resetCallback}>here</A>.
    </P>
  </Box>
)

const SectionBase = styled(Box).attrs({})`
  border-bottom: 1px solid ${({ theme }) => theme.colors.smoke};
`
const SectionFlex = styled(Flex).attrs({
  py: 4,
  px: [3, 0],
  mx: [-3, 0],
  align: 'center'
})`
  min-height: ${props => (props.sm ? 6 : 10)}rem;
`
const SectionHeading = styled(Heading.h2).attrs({
  f: props => (props.sm ? 4 : 5),
  regular: true,
  align: 'left'
})`
  line-height: 1.25;
  max-width: 32rem;
`
const SectionIcon = styled(Icon).attrs({
  color: props => (props.open ? 'gray.5' : 'gray.4'),
  size: 36,
  ml: 'auto'
})`
  transition: ${({ theme }) => theme.transition} all;
  transform: rotate(${props => (props.open ? 90 : 0)}deg);
  user-select: none;
`

class Section extends Component {
  state = { open: false }

  toggle = e =>
    this.setState(({ open }) => ({ open: this.props.to ? open : !open }))

  render() {
    const { open } = this.state
    const { name, openContent, to, sm, ...props } = this.props
    const Element = to ? Link : Fragment
    return (
      <Element to={to}>
        <SectionBase>
          <SectionFlex
            {...props}
            onClick={this.toggle}
            sm={sm}
            aria-expanded={open}
          >
            <SectionHeading sm={sm} children={name} />
            <SectionIcon
              open={open}
              name={to ? 'arrow_forward' : 'more_horiz'}
            />
          </SectionFlex>
          {open && openContent}
        </SectionBase>
      </Element>
    )
  }
}

const HelpSheet = styled(Container.withComponent(Card))`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`

const Help = () => (
  <HelpSheet maxWidth={42} mt={[3, 4]} py={3} px={[3, 4]} bg="blue.0">
    <Flex align="center" flex="1 1 auto" mb={[3, 0]}>
      <Icon name="live_help" size={24} mr={[2, 3]} color="info" />
      <Text color="info" f={2} align="left">
        Have any questions? We’re here to help out.
      </Text>
    </Flex>
    <ContactModal />
  </HelpSheet>
)

const SubmitStatus = Text.withComponent('mark').extend`
  background: transparent url(/underline.svg) bottom left no-repeat;
  background-size: 100% 0.75rem;
  padding-bottom: 0.125rem;
`

const profileStatus = profile =>
  profile.completed_at !== null
    ? 'complete'
    : profile.created_at === profile.updated_at
      ? 'unopened'
      : 'incomplete'

const Main = props => {
  const {
    id,
    leader_profiles,
    updated_at,
    created_at,
    submitted_at,
    point_of_contact_id
  } = props.app
  const { callback, app, resetCallback } = props

  const leaderProfile = leader_profiles.find(
    profile => profile.user.id == props.userId
  )
  const coLeaderProfiles = leader_profiles.filter(
    profile => profile.user.id != props.userId
  )
  const isPoc = leaderProfile.user.id === point_of_contact_id

  const completeProfiles = leader_profiles.every(
    profile => profile.completed_at
  )
  const completeApplication = clubApplicationSchema.isValidSync(app)
  let submitButtonStatus
  if (app.submitted_at) {
    submitButtonStatus = 'submitted'
  } else if (completeApplication && completeProfiles) {
    submitButtonStatus = 'complete'
  } else {
    submitButtonStatus = 'incomplete'
  }
  const applicationStatus = profile =>
    completeApplication
      ? 'complete'
      : created_at === updated_at
        ? 'unopened'
        : 'incomplete'

  const submitStatusProps = {
    unopened: { color: 'primary', children: 'ready for you!' },
    incomplete: { color: 'warning', children: 'in progress.' },
    complete: { bg: 'info', children: 'completed!' },
    submitted: { bg: 'success', children: 'submitted!' }
  }[submitButtonStatus]

  return (
    <Container maxWidth={52} my={4}>
      <Sheet p={[3, 4, 5]}>
        <Heading.h3 f={[4, 5]} mb={2}>
          How to get into Hack Club
        </Heading.h3>
        <P f={3}>
          Our admissions process is very competitive, accepting less than 5% of
          applicants. Here’s what we look for:
        </P>
        <ul>
          <li>
            Strong founding teams with 2-3 members. You probably can’t do it
            alone and we rarely accept solo founders.
          </li>
          <li>
            Diverse skillsets on leadership team—the best Hack Clubs are led by
            both CEO and CTO types.
          </li>
          <li>
            Traction. Indicators of progress to date, especially formal shows of
            support from your school (like securing a teacher sponsor), are very
            meaningful.
          </li>
        </ul>
        <Help />
      </Sheet>
      <Sheet p={[3, 4, 5]}>
        <Title my={4} style={{ position: 'relative' }}>
          Your application to Hack Club is{' '}
          <SubmitStatus {...submitStatusProps} />
        </Title>
        <Section
          to={`/apply/club?id=${id}`}
          name={
            <Fragment>
              <Text.span bold>Club application</Text.span>
              <Status type={applicationStatus()} ml={2} />
            </Fragment>
          }
        />
        <Section
          to={`/apply/leader?id=${leaderProfile.id}`}
          name={
            <Fragment>
              <Text.span bold>My personal profile</Text.span>
              <Status type={profileStatus(leaderProfile)} ml={2} />
            </Fragment>
          }
        />

        <LeaderInvite id={id} callback={callback} />

        {coLeaderProfiles.length === 0 && (
          <Text py={3} color="muted" align="center" f={3}>
            <Text.span bold>No co-leaders yet!</Text.span>
            <br />Tap the green button to add them.
          </Text>
        )}
        {coLeaderProfiles.map(profile => (
          <Section
            key={profile.id}
            sm
            name={
              <Fragment>
                <Text.span children={profile.user.name || profile.user.email} />
                <Status type={profileStatus(profile)} bg="muted" ml={2} />
              </Fragment>
            }
            openContent={
              <Text mb={3} align="right">
                <Text.span f={3} color="gray.5" mx={1}>
                  Invited {timeSince(profile.created_at)}.
                </Text.span>
                <Text.span f={3} color="gray.5" mx={1}>
                  {profile.updated_at === null
                    ? 'Not updated yet.'
                    : `Last updated ${timeSince(profile.updated_at)}.`}
                </Text.span>
                {isPoc && (
                  <Button
                    m={2}
                    onClick={e => {
                      if (
                        confirm(
                          `Are you sure you want to remove ${
                            profile.user.email
                          } as a team member?`
                        )
                      ) {
                        api
                          .delete(
                            `v1/new_club_applications/${id}/remove_user`,
                            {
                              data: { user_id: profile.user.id }
                            }
                          )
                          .then(json => {
                            callback()
                          })
                          .catch(e => {
                            alert(e.statusText)
                          })
                      }
                    }}
                    children="Remove"
                  />
                )}
              </Text>
            }
          />
        ))}
        <Box mt={5}>
          {app.rejected_at ? (
            <Rejected resetCallback={resetCallback} />
          ) : (
            <SubmitButton
              applicationId={app.id}
              status={submitButtonStatus}
              callback={callback}
            />
          )}
        </Box>
      </Sheet>
    </Container>
  )
}

export default Main
