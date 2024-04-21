import {
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {tw} from '@lib';
import {
  BottomModal,
  ModalTitle,
  ModalFooter,
  ModalContent,
} from 'react-native-modals';
import {BUNDLE} from '@queries';
import {CCButton} from './CCButton';
import {gql, useMutation} from '@apollo/client';
import config from 'react-native-ultimate-config';
import {showMessage} from 'react-native-flash-message';
import React, {memo, useCallback, useMemo, useRef, useState} from 'react';

const INITIATE_TRANSACTION = gql`
  mutation initiateTransaction($transactionInput: TransactionInput!) {
    initiateTransaction(transactionInput: $transactionInput) {
      code
      success
      message
      token
      txnToken
      payload {
        orderId
        status
        txnAmount
        txnNote
        payeeVPA
        payeeName
        payeeMerchantCode
      }
    }
  }
`;

const UPDATE_TRANSACTION = gql`
  mutation updateTransaction(
    $orderId: String!
    $transactionInput: TransactionUpdateInput!
  ) {
    updateTransaction(orderId: $orderId, transactionInput: $transactionInput) {
      code
      success
      message
      token
    }
  }
`;

const CANCELLED_TRANSACTION = gql`
  mutation cancelledTransaction($orderId: String!) {
    cancelledTransaction(orderId: $orderId) {
      code
      success
      message
      token
    }
  }
`;

const PROCESS_TRANSACTION = gql`
  mutation processTransaction(
    $orderId: String!
    $transactionInput: TransactionProcessInput!
  ) {
    processTransaction(orderId: $orderId, transactionInput: $transactionInput) {
      code
      success
      message
      token
      payload {
        _id
        type
        subject
        title
        price
        offer
        offerType
        validTill
        orderId
        status
        txnAmount
        txnNote
        txnId
        txnInfo
        paymentMode
        paymentApp
        paymentVPA
        createdAt
        updatedAt
      }
    }
  }
`;

export const CCPurchaseButton = memo(
  ({item, initial = false, onPurchased, refetchQueries = [], children}) => {
    const bottomModalRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState('NULL');
    const [purchased, setPurchased] = useState(initial);
    const [paymentDetails, setPaymentDetails] = useState(null);

    const priceDetails = useMemo(() => {
      const data = {'List price': item?.price};
      if (item?.offer) {
        data[
          `Discount (${
            item?.offerType === 'PERCENT'
              ? `${item?.offer}%`
              : `₹${item?.offer}`
          } off)`
        ] = -(item?.offerType === 'PERCENT'
          ? (item?.price * item?.offer) / 100
          : item?.offer);
      }
      data['Total Amount'] = Object.values(data).reduce(
        (acc, curr) => acc + curr,
        0,
      );
      return data;
    }, [item]);

    const [initiateTransaction, {loading: initiating}] = useMutation(
      INITIATE_TRANSACTION,
      {
        variables: {
          transactionInput: {
            itemId: item?._id,
            type: item?.__typename,
            txnAmount: priceDetails['Total Amount'],
          },
        },
        onCompleted: data => {
          console.log('data', data?.initiateTransaction?.payload);
          setPaymentDetails(data?.initiateTransaction?.payload);
          setStatus('CREATED');
        },
        onError: err => {
          showMessage({
            message: err?.message || 'Some unknown error occurred. Try again!!',
            type: 'danger',
          });
        },
      },
    );

    const [updateTransaction, {loading: updating}] = useMutation(
      UPDATE_TRANSACTION,
      {
        onCompleted: data => {
          console.log('data', data?.updateTransaction);
          setStatus('ACTIVE');
        },
        onError: err => {
          showMessage({
            message: err?.message || 'Some unknown error occurred. Try again!!',
            type: 'danger',
          });
        },
      },
    );

    const [cancelledTransaction, {loading: cancelling}] = useMutation(
      CANCELLED_TRANSACTION,
      {
        variables: {orderId: paymentDetails?.orderId},
        onCompleted: data => {
          console.log('data', data?.cancelledTransaction);
          setStatus('CANCELLED');
        },
        onError: err => {
          showMessage({
            message: err?.message || 'Some unknown error occurred. Try again!!',
            type: 'danger',
          });
        },
      },
    );

    const [processTransaction, {loading: processing}] = useMutation(
      PROCESS_TRANSACTION,
      {
        onCompleted: data => {
          console.log('data', data?.processTransaction?.payload);
          if (data?.processTransaction?.payload?.status === 'PAID') {
            setPurchased(true);
            setStatus('PAID');
          }
        },
        onError: err => {
          showMessage({
            message: err?.message || 'Some unknown error occurred. Try again!!',
            type: 'danger',
          });
        },
        refetchQueries,
      },
    );

    const onPress = useCallback(() => {
      if (purchased) {
        onPurchased && onPurchased();
      } else {
        setOpen(true);
      }
    }, [purchased, onPurchased]);

    const closeModal = useCallback(() => {
      setOpen(false);
      setPaymentDetails(null);
    }, []);

    const payWithUPI = useCallback(() => {
      console.log('Open UPI');
      // TODO: implement UPI payment functionality.
      const transactionInput = {
        paymentApp: 'PAYTM',
        paymentMode: 'UPI_INTENT',
        paymentVPA: '9009630808@pz',
      };
      updateTransaction({
        variables: {
          orderId: paymentDetails?.orderId,
          transactionInput,
        },
      });
    }, [paymentDetails, updateTransaction]);

    const claimForFree = useCallback(() => {
      processTransaction({
        variables: {
          orderId: paymentDetails?.orderId,
          transactionInput: {txnId: 'FREE_0'},
        },
      });
    }, [paymentDetails, processTransaction]);

    const footerComp = useMemo(() => {
      switch (status) {
        case 'NULL':
          return (
            <CCButton
              label="Proceed to Payment  ➔"
              style={tw`py-2 px-6`}
              loading={initiating}
              disabled={initiating}
              onPress={initiateTransaction}
            />
          );
        case 'CREATED':
          return (
            <CCButton
              label={
                paymentDetails?.txnAmount ? 'Pay with UPI' : 'Claim for Free'
              }
              color="green-700"
              style={tw`py-2 px-6`}
              loading={updating || processing}
              disabled={updating || processing}
              onPress={paymentDetails?.txnAmount ? payWithUPI : claimForFree}
            />
          );
        case 'ACTIVE':
          return (
            <CCButton
              label="Cancel"
              color="red-700"
              style={tw`py-2 px-6`}
              loading={cancelling}
              disabled={cancelling}
              onPress={cancelledTransaction}
            />
          );
        case 'CANCELLED':
          return (
            <CCButton
              label="Ok"
              color="black"
              style={tw`py-2 px-6`}
              onPress={closeModal}
            />
          );
        case 'PAID':
          return (
            <CCButton
              label="Close"
              color="black"
              style={tw`py-2 px-6`}
              onPress={closeModal}
            />
          );
        default:
          return null;
      }
    }, [
      status,
      initiating,
      updating,
      cancelling,
      processing,
      paymentDetails,
      initiateTransaction,
      payWithUPI,
      claimForFree,
      cancelledTransaction,
      closeModal,
    ]);

    return (
      <>
        <TouchableOpacity
          disabled={!item}
          onPress={onPress}
          style={tw`opacity-${item ? 100 : 50}`}>
          {children(purchased)}
        </TouchableOpacity>
        <BottomModal
          ref={bottomModalRef}
          visible={open}
          modalTitle={
            <ModalTitle
              title="Order Summary"
              align="flex-start"
              hasTitleBar={true}
              style={tw`px-3 py-2`}
              textStyle={tw`text-lg text-black font-avReg`}
            />
          }
          footer={
            <ModalFooter bordered={true} style={tw`justify-between py-2 px-3`}>
              <View>
                {status !== 'CANCELLED' && (
                  <>
                    <Text style={tw`font-avReg text-xs text-gray-600`}>
                      {purchased ? 'You Paid' : 'You Pay'}
                    </Text>
                    <Text style={tw`font-avBold text-base text-gray-900`}>
                      ₹ {priceDetails['Total Amount']}
                    </Text>
                  </>
                )}
              </View>
              {footerComp}
            </ModalFooter>
          }
          swipeDirection="down"
          swipeThreshold={200}
          onSwipeOut={closeModal}
          onTouchOutside={closeModal}
          onHardwareBackPress={() => true}>
          <ModalContent style={tw`py-2 px-3`}>
            <View style={tw`flex-row bg-gray-50 rounded-lg shadow-sm`}>
              <ImageBackground
                resizeMode="cover"
                source={{
                  uri: `${
                    __DEV__
                      ? config.REACT_APP_DEV_URI
                      : config.REACT_APP_PROD_URI
                  }/${item?.image}`,
                }}
                imageStyle={tw`rounded-lg opacity-50`}
                style={tw`rounded-lg items-center shadow-sm bg-black h-[96px]`}>
                <Image
                  source={{
                    uri: `${
                      __DEV__
                        ? config.REACT_APP_DEV_URI
                        : config.REACT_APP_PROD_URI
                    }/${item?.image}`,
                  }}
                  resizeMode="contain"
                  style={tw.style({
                    height: 96,
                    borderRadius: 8,
                    aspectRatio: 16 / 9,
                  })}
                />
              </ImageBackground>
              <View style={tw`flex-1 px-2 py-3 justify-between`}>
                <View style={tw`flex-row justify-between`}>
                  <Text
                    style={tw`flex-1 font-avSemi text-green-700 text-[10px]`}
                    numberOfLines={1}>
                    {item?.subject}
                  </Text>
                  {!!item?.offer && (
                    <Text style={tw`font-avSemi text-red-500 text-[10px]`}>
                      {`${
                        item?.offerType === 'PERCENT'
                          ? `${item?.offer}%`
                          : `₹${item?.offer}`
                      } Off`}
                    </Text>
                  )}
                </View>
                <Text
                  style={tw`font-avSemi text-xs text-gray-600`}
                  numberOfLines={2}>
                  {item?.title}
                </Text>
                <View style={tw`flex-row items-center justify-between`}>
                  <Text
                    style={tw`font-avSemi rounded text-xs px-2 bg-green-50 text-green-600 shadow-sm`}>
                    {item?.offer
                      ? `₹ ${
                          item?.price -
                          (item?.offerType === 'PERCENT'
                            ? (item?.price * item?.offer) / 100
                            : item?.offer)
                        }`
                      : `₹ ${item?.price}`}
                  </Text>
                  {!!item?.offer && (
                    <Text
                      style={tw.style(
                        'px-1 font-avReg text-gray-500 text-[10px]',
                        {
                          textDecorationLine: 'line-through',
                          textDecorationStyle: 'solid',
                        },
                      )}>
                      {`₹ ${item?.price}`}
                    </Text>
                  )}
                </View>
              </View>
            </View>
            <View style={tw`mt-2 px-2 py-2`}>
              {Object.keys(priceDetails).map(key => (
                <OrderItem key={key} name={key} amount={priceDetails[key]} />
              ))}
              {item?.offer ? (
                <Text
                  style={tw`pt-2 text-right font-avSemi text-xs text-green-600`}>
                  {`You will save ₹${Math.abs(
                    priceDetails[
                      `Discount (${
                        item?.offerType === 'PERCENT'
                          ? `${item?.offer}%`
                          : `₹${item?.offer}`
                      } off)`
                    ],
                  )} on this order.`}
                </Text>
              ) : null}
            </View>
          </ModalContent>
        </BottomModal>
      </>
    );
  },
);

const OrderItem = memo(({name, amount}) => (
  <>
    <View
      style={tw`flex-row justify-between ${
        name === 'Total Amount' ? 'pt-3 border-t border-gray-200' : 'pb-3'
      }`}>
      <Text
        style={tw`font-${
          name === 'Total Amount' ? 'avSemi' : 'avReg'
        } text-gray-600`}>
        {name}
      </Text>
      <Text
        style={tw`font-${name === 'Total Amount' ? 'avSemi' : 'avReg'} text-${
          amount < 0 ? 'green' : 'gray'
        }-600`}>
        {amount < 0 ? `- ₹ ${Math.abs(amount)}` : `₹ ${amount}`}
      </Text>
    </View>
  </>
));
