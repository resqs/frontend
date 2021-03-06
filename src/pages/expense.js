import React from 'react';
import withData from '../lib/withData';
import withIntl from '../lib/withIntl';
import { FormattedMessage } from 'react-intl'

import { addCollectiveCoverData, addGetLoggedInUserFunction } from '../graphql/queries';
import Header from '../components/Header';
import Body from '../components/Body';
import Footer from '../components/Footer';
import CollectiveCover from '../components/CollectiveCover';
import ErrorPage from '../components/ErrorPage';
import Link from '../components/Link';

import ExpenseWithData from '../apps/expenses/components/ExpenseWithData';


class ExpensePage extends React.Component {

  static getInitialProps (props) {
    const { query: { collectiveSlug, ExpenseId }, data } = props;
    return { slug: collectiveSlug, data, ExpenseId }
  }

  constructor(props) {
    super(props);
    this.state = {
      isPayActionLocked: false,
    };
  }

  async componentDidMount() {
    const { getLoggedInUser } = this.props;
    const LoggedInUser = getLoggedInUser && await getLoggedInUser(this.props.collectiveSlug);
    this.setState({ LoggedInUser });
  }

  render() {
    const { data, ExpenseId } = this.props;
    const { LoggedInUser } = this.state;

    if (!data.Collective) return (<ErrorPage data={data} />);

    const collective = data.Collective;

    return (
      <div className="ExpensePage">
        <style jsx>{`
          .columns {
            display: flex;
          }

          .col.side {
            width: 100%;
            min-width: 20rem;
            max-width: 25%;
            margin-left: 5rem;
          }

          .col.large {
            width: 100%;
            min-width: 30rem;
            max-width: 75%;
          }

          @media(max-width: 600px) {
            .columns {
              flex-direction: column-reverse;
              .col {
                max-width: 100%;
              }
            }
          }

          .viewAllExpenses {
            font-size: 1.2rem;
          }
        `}</style>

        <Header
          title={collective.name}
          description={collective.description}
          twitterHandle={collective.twitterHandle}
          image={collective.image || collective.backgroundImage}
          className={this.state.status}
          LoggedInUser={LoggedInUser}
          />

        <Body>

          <CollectiveCover
            collective={collective}
            cta={{ href: `/${collective.slug}#contribute`, label: 'contribute' }}
            LoggedInUser={LoggedInUser}
            />

          <div className="content" >

            <div className=" columns" >

              <div className="col large">
                <div className="viewAllExpenses">
                  <Link route={`/${collective.slug}/expenses`}><FormattedMessage id="expenses.viewAll" defaultMessage="View All Expenses" /></Link>
                </div>

                <ExpenseWithData
                  id={ExpenseId}
                  collective={collective}
                  view="details"
                  LoggedInUser={this.state.LoggedInUser}
                  allowPayAction={!this.state.isPayActionLocked}
                  lockPayAction={() => this.setState({ isPayActionLocked: true })}
                  unlockPayAction={() => this.setState({ isPayActionLocked: false })}
                />

              </div>

              <div className="col side">
              </div>

            </div>
          </div>

        </Body>

        <Footer />

      </div>
    );
  }

}

export default withData(addGetLoggedInUserFunction(addCollectiveCoverData(withIntl(ExpensePage))));
