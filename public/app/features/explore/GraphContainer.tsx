import React, { PureComponent } from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import { TimeRange, RawTimeRange, Timezone } from '@grafana/ui';

import { ExploreId, ExploreItemState } from 'app/types/explore';
import { StoreState } from 'app/types';

import { toggleGraph, changeTime } from './state/actions';
import Graph from './Graph';
import Panel from './Panel';
import { getTimezone } from '../profile/state/selectors';

interface GraphContainerProps {
  exploreId: ExploreId;
  graphResult?: any[];
  loading: boolean;
  range: RawTimeRange;
  showingGraph: boolean;
  showingTable: boolean;
  split: boolean;
  toggleGraph: typeof toggleGraph;
  changeTime: typeof changeTime;
  width: number;
  timezone: Timezone;
}

export class GraphContainer extends PureComponent<GraphContainerProps> {
  onClickGraphButton = () => {
    this.props.toggleGraph(this.props.exploreId, this.props.showingGraph);
  };

  onChangeTime = (timeRange: TimeRange) => {
    this.props.changeTime(this.props.exploreId, timeRange);
  };

  render() {
    const { exploreId, graphResult, loading, showingGraph, showingTable, range, split, width, timezone } = this.props;
    const graphHeight = showingGraph && showingTable ? 200 : 400;

    if (!graphResult) {
      return null;
    }

    return (
      <Panel label="Graph" isOpen={showingGraph} loading={loading} onToggle={this.onClickGraphButton}>
        <Graph
          data={graphResult}
          height={graphHeight}
          id={`explore-graph-${exploreId}`}
          onChangeTime={this.onChangeTime}
          range={range}
          timezone={timezone}
          split={split}
          width={width}
        />
      </Panel>
    );
  }
}

function mapStateToProps(state: StoreState, { exploreId }) {
  const explore = state.explore;
  const { split } = explore;
  const item: ExploreItemState = explore[exploreId];
  const { graphResult, queryTransactions, range, showingGraph, showingTable } = item;
  const loading = queryTransactions.some(qt => qt.resultType === 'Graph' && !qt.done);
  return { graphResult, loading, range, showingGraph, showingTable, split, timezone: getTimezone(state.user) };
}

const mapDispatchToProps = {
  toggleGraph,
  changeTime,
};

export default hot(module)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(GraphContainer)
);
