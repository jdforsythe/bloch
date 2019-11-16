/* tslint:disable completed-docs no-implicit-dependencies no-import-side-effect no-unused-expression function-name */
import { suite, test } from '@testdeck/mocha';
import { expect } from 'chai';
import 'mocha';

import { UnfinishedBlock } from './interface';

import {
  getGenesisBlock,
  hashBlock,
} from './block';

@suite export class BlockTests {
  @test 'should return correct genesis block'() {
    const actual = getGenesisBlock();

    expect(actual.timestamp).to.equal(380221200000);
    expect(actual.lastHash).to.equal('bigbang');
    expect(actual.hash).to.equal('0000c5f48c60d075730f45945cc7f8cad953e7d0f168186c8c7d3ff07db6f0f7');
    expect(actual.data[0].id).to.equal('genesis');
    expect(actual.data[0].outputs[0].address).to.equal('046acf12468cb92de2e7bf7442987d73c183719454ccd91e42c5785437954c97418ec6fa979c63e82f4dd794db28f86f41ac81275603dbad9f99ac06d5046c133a');
    expect(actual.data[0].outputs[0].amount).to.equal(1000);
    expect(actual.nonce).to.equal(195250);
    expect(actual.difficulty).to.equal(4);
  }

  @test 'should hash block correctly'() {
    const block: UnfinishedBlock = {
      timestamp: 380221200000,
      lastHash: 'bigbang',
      data: [{
        id: 'genesis',
        input: {},
        outputs: [
          {
            address: '046acf12468cb92de2e7bf7442987d73c183719454ccd91e42c5785437954c97418ec6fa979c63e82f4dd794db28f86f41ac81275603dbad9f99ac06d5046c133a',
            amount: 1000,
          },
        ],
      }],
      nonce: 195250,
      difficulty: 4,
    };

    const expected = 'e936a8c7bf81af9126474cbd73e36893024a159bc4d1845d406daae3d30b0d3f';

    const actual = hashBlock(block);

    expect(actual).to.equal(expected);

  }
}
